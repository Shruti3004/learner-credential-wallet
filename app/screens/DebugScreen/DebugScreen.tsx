import React, { useMemo } from 'react';
import { useSelector } from 'react-redux';
import { Text, View, ScrollView } from 'react-native';
import { Header, Button } from 'react-native-elements';

import { mixins } from '../../styles';
import { RootState } from '../../store';
import { DidState } from '../../store/slices/did';

import styles from './DebugScreen.styles';
import { DebugScreenProps } from '../../navigation/HomeNavigation/HomeNavigation.d';

export default function DebugScreen({ navigation, route }: DebugScreenProps): JSX.Element {
  const { rawCredentialRecord } = route.params;
  const { rawDidRecords } = useSelector<RootState, DidState>(({ did }) => did);
  const [ rawDidRecord ] = rawDidRecords;

  function goBack() {
    navigation.goBack();
  }

  function Exit(): JSX.Element {
    return (
      <Button onPress={goBack}>
        Exit
      </Button>
    );
  }

  return (
    <>
      <Header
        centerComponent={{ text: 'Home', style: mixins.headerTitle}}
        containerStyle={mixins.headerContainer}
        rightComponent={<Exit />}
      />
      <ScrollView>
        <View style={styles.container}>
          <Text style={styles.paragraph}>Credential:</Text>
          <Text style={styles.codeBlock} selectable>
            {JSON.stringify(rawCredentialRecord.credential, null, 2)}
          </Text>
          <Text style={styles.paragraph}>DID Document:</Text>
          <Text style={styles.codeBlock} selectable>
            {JSON.stringify(rawDidRecord.didDocument, null, 2)}
          </Text>
          <Text style={styles.paragraph}>Verification Key:</Text>
          <Text style={styles.codeBlock} selectable>
            {JSON.stringify(rawDidRecord.verificationKey, null, 2)}
          </Text>
          <Text style={styles.paragraph}>Key Agreement Key:</Text>
          <Text style={styles.codeBlock} selectable>
            {JSON.stringify(rawDidRecord.keyAgreementKey, null, 2)}
          </Text>
        </View>
      </ScrollView>
    </>
  );
}
