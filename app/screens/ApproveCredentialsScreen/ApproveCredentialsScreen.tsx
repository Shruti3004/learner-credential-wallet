import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { FlatList, View, Text } from 'react-native';
import { Button } from 'react-native-elements';

import { navigationRef } from '../../navigation';
import { acceptPendingCredentials, clearFoyer, selectPendingCredentials } from '../../store/slices/credentialFoyer';
import { CredentialItem, NavHeader, CredentialRequestHandler, ApprovalControls, ConfirmModal } from '../../components';
import { ApproveCredentialsScreenProps, RenderItemProps } from './ApproveCredentialsScreen.d';
import dynamicStyleSheet from './ApproveCredentialsScreen.styles';
import { useAppDispatch, useDynamicStyles } from '../../hooks';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function ApproveCredentialsScreen({ navigation, route }: ApproveCredentialsScreenProps): JSX.Element {
  const { mixins, styles } = useDynamicStyles(dynamicStyleSheet);

  const dispatch = useAppDispatch();
  const { rawProfileRecord, credentialRequestParams } = route.params;
  const profileRecordId = rawProfileRecord._id;
  const pendingCredentials = useSelector(selectPendingCredentials);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [showAcceptAllButton, setShowAcceptAllButton] = useState(true);

  async function goToHome() {
    await dispatch(clearFoyer());
    if (navigationRef.isReady()) {
      navigationRef.navigate('HomeNavigation', { 
        screen: 'CredentialNavigation',
        params: {
          screen: 'HomeScreen',
        }, 
      });
    }
  }

  async function acceptAllCredentials() {
    try {
      await dispatch(acceptPendingCredentials({ pendingCredentials, profileRecordId }));
      goToHome();
    } catch (err) {
      setModalIsOpen(true);
    }
  }

  function onModalRequestClose() {
    setModalIsOpen(false);
    setShowAcceptAllButton(false);
  }

  function Done(): JSX.Element {
    return (
      <Button
        buttonStyle={styles.doneButton}
        titleStyle={styles.doneButtonTitle}
        onPress={goToHome}
        title="Done"
      />
    );
  }

  const ListFooter = !showAcceptAllButton ? <SafeAreaView edges={['bottom']} /> : undefined;

  function renderItem({ item: pendingCredential }: RenderItemProps) {
    const { credential } = pendingCredential;
    const onSelect = () => navigation.navigate(
      'ApproveCredentialScreen',
      {
        pendingCredentialId: pendingCredential.id,
        profileRecordId,
      },
    );

    return (
      <CredentialItem
        credential={credential}
        onSelect={onSelect}
        bottomElement={<ApprovalControls pendingCredential={pendingCredential} profileRecordId={profileRecordId} />}
        chevron
      />
    );
  }

  return (
    <>
      <NavHeader 
        title="Available Credentials" 
        rightComponent={<Done />}
      />
      <CredentialRequestHandler
        credentialRequestParams={credentialRequestParams}
        rawProfileRecord={rawProfileRecord}
        onFailed={goToHome}
      />
      <View style={styles.container}>
        <View style={styles.listHeader}>
          <Text style={styles.profileText}><Text style={styles.profileTextBold}>Storing in Profile:</Text> {rawProfileRecord.profileName}</Text>
        </View>
        <FlatList
          style={styles.listContainer}
          contentContainerStyle={styles.listContentContainer}
          ListFooterComponent={ListFooter}
          data={pendingCredentials}
          renderItem={renderItem}
          keyExtractor={(_, index) => `credential-${index}`}
        />
      </View>
      {showAcceptAllButton && (
        <SafeAreaView style={styles.footerContainer} edges={['bottom']}>
          <Button
            containerStyle={mixins.buttonContainerVertical}
            buttonStyle={[mixins.button, mixins.buttonPrimary, styles.acceptAllButton]}
            titleStyle={[mixins.buttonTitle, styles.acceptAllButtonTitle]}
            title="Accept All"
            onPress={acceptAllCredentials}
          />
        </SafeAreaView>)}
      <ConfirmModal
        open={modalIsOpen}
        title="Unable To Add Credentials"
        onRequestClose={onModalRequestClose}
        confirmText="Close"
        cancelButton={false}
      >
        <Text style={mixins.modalBodyText}>Some credentials were not able to be added to your wallet.</Text>
      </ConfirmModal>
    </>
  );
}
