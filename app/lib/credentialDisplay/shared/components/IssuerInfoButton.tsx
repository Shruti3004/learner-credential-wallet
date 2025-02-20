import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { Text, View } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';

import { useDynamicStyles } from '../../../../hooks';
import { createDynamicStyleSheet } from '../../../dynamicStyles';

type IssuerInfoButtonProps = {
  issuerId: string | null,
  issuerName: string | null,
  onPress: (issuerId: string) => void,
}

export default function IssuerInfoButton({ issuerId, issuerName, onPress }: IssuerInfoButtonProps): JSX.Element | null {
  const { styles, theme } = useDynamicStyles(dynamicStyleSheet);

  function _onPress() {
    if (issuerId) {
      onPress(issuerId);
    }
  }

  return (
    <TouchableOpacity onPress={_onPress} disabled={!issuerId}>
      <View style={[styles.flexRow, styles.alignCenter]}>
        <Text style={styles.issuerValue}>{issuerName}</Text>
        {issuerId && <MaterialIcons name="info-outline" size={19} color={theme.color.textPrimary} style={styles.infoIcon} />}
      </View>
    </TouchableOpacity> 
  );
}

const dynamicStyleSheet = createDynamicStyleSheet(({ theme }) => ({
  alignCenter: {
    alignItems: 'center',
  },
  issuerValue: {
    fontFamily: theme.fontFamily.regular,
    fontSize: theme.fontSize.regular,
    color: theme.color.textPrimary,
  },
  infoIcon: {
    marginLeft: 8,
  },
  flexRow: {
    flexDirection: 'row',
  },
}));