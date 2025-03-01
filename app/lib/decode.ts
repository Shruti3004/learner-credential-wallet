import { fromQrCode, toQrCode } from '@digitalcredentials/vpqr';
import qs from 'query-string';

import { securityLoader } from '@digitalcredentials/security-document-loader';
//import { verifyPresentation } from '../lib/validate';
import type { Credential } from '../types/credential';
//import { VerifiablePresentation, PresentationError } from '../types/presentation';
import { VerifiablePresentation } from '../types/presentation';
import { CredentialRequestParams } from './credentialRequest';
import { isCredentialRequestParams } from './credentialRequest';
import { HumanReadableError } from './error';
import { isVerifiableCredential, isVerifiablePresentation } from './verifiableObject';

const documentLoader = securityLoader().build();
export const regexPattern = {
  vpqr: /^VP1-[A-Z|0-9]+/,
  url: /^https?:\/\/.+/,
  json: /^{.*}$/s,
};

export function isDeepLink(text: string): boolean {
  return text.startsWith('dccrequest://request?') || text.startsWith('org.dcconsortium://request?');
}

export function queryParamsFrom(url: string): Record<string, unknown> {
  const { query } = qs.parseUrl(url);
  return query;
}

export function credentialRequestParamsFromQrText(text: string): CredentialRequestParams {
  const params = qs.parse(text.split('?')[1]);
  const isValid = isCredentialRequestParams(params);

  if (!isValid) {
    throw new HumanReadableError('The QR code contained an invalid deep link.');
  }

  return params as CredentialRequestParams;
}

export async function toQr(vp: VerifiablePresentation): Promise<string> {
  const result = await toQrCode({ vp, documentLoader });
  return result.payload;
}

function credentialsFromPresentation(vp: VerifiablePresentation): Credential[] {
  const { verifiableCredential } = vp;
  return ([] as Credential[]).concat(verifiableCredential);
}

async function credentialsFromVpqr(text: string): Promise<Credential[]> {
  const { vp }: { vp: VerifiablePresentation } = await fromQrCode({ text, documentLoader });
  return credentialsFromPresentation(vp);
}

async function credentialsFromJson(text: string): Promise<Credential[]> {
  const data = JSON.parse(text);
  
  if (isVerifiablePresentation(data)) {
    return credentialsFromPresentation(data);
  }

  if (isVerifiableCredential(data)) {
    return [data];
  }

  throw new Error('Credential(s) could not be decoded from the JSON.');
}

/**
 * A method for decoding credentials from a variety text formats.
 * 
 * @param text - A string containing a VPQR, URL, or JSON object.
 * @returns {Promise<Credential[]>} - An array of credentials.
 */
export async function credentialsFrom(text: string): Promise<Credential[]> {
  if (regexPattern.url.test(text)) {
    const response = await fetch(text);
    text = await response.text().then((t) => t.trim());
  }

  if (regexPattern.vpqr.test(text)) {
    return credentialsFromVpqr(text);
  }

  console.log(text);

  if (regexPattern.json.test(text)) {
    return credentialsFromJson(text);
  }

  throw new Error('No credentials were resolved from the text');
}
