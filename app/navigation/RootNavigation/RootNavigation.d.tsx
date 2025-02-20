import type { NavigatorScreenParams } from '@react-navigation/native';
import type { StackScreenProps } from '@react-navigation/stack';
import type { CredentialRecordRaw } from '../../model/credential';
import type { VerifyPayload } from '../../hooks';
import type { HomeNavigationParamList, AcceptCredentialsNavigationParamList } from '../';
import { Credential } from '../../types/credential';
import { ProfileRecordRaw } from '../../model';
import { CredentialSelectionScreenParams, ProfileSelectionScreenParams, QRScreenParams } from '../../screens';

export type RootNavigationParamsList = {
  HomeNavigation: NavigatorScreenParams<HomeNavigationParamList>;
  DebugScreen: {
    rawCredentialRecord: CredentialRecordRaw;
    rawProfileRecord: ProfileRecordRaw;
  };
  QRScreen: QRScreenParams;
  VerificationStatusScreen: {
    credential: Credential;
    verifyPayload: VerifyPayload;
  };
  AcceptCredentialsNavigation: NavigatorScreenParams<AcceptCredentialsNavigationParamList>;
  ProfileSelectionScreen: ProfileSelectionScreenParams;
  CredentialSelectionScreen: CredentialSelectionScreenParams;
};

export type HomeNavigationProps = StackScreenProps<RootNavigationParamsList, 'HomeNavigation'>
export type DebugScreenProps = StackScreenProps<RootNavigationParamsList, 'DebugScreen'>
export type VerificationStatusScreenProps = StackScreenProps<RootNavigationParamsList, 'VerificationStatusScreen'>
export type AcceptCredentialsNavigationProps = StackScreenProps<RootNavigationParamsList, 'AcceptCredentialsNavigation'>
export type QRScreenProps = StackScreenProps<RootNavigationParamsList, 'QRScreen'>;
export type ProfileSelectionScreenProps = StackScreenProps<RootNavigationParamsList, 'ProfileSelectionScreen'>;
export type CredentialSelectionScreenProps = StackScreenProps<RootNavigationParamsList, 'CredentialSelectionScreen'>;
