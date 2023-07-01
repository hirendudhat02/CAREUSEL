import React from 'react';
import {
  View,
  ActivityIndicator,
  StyleSheet,
  Modal,
  Dimensions,
} from 'react-native';
import {colors} from '../theme';
import {scale} from './ResponsiveFonts';

const Loader = Props => {
  return Props.value === true ? (
    <Modal visible={true} transparent={true}>
      <View style={styles.Container}>
        <ActivityIndicator
          size="large"
          color={colors.secoundry}
          style={{
            height: scale(50),
            width: scale(50),
            justifyContent: 'center',
            alignItems: 'center',
            alignSelf: 'center',
          }}
        />
      </View>
    </Modal>
  ) : null;
};
const styles = StyleSheet.create({
  Container: {
    justifyContent: 'center',
    alignItems: 'center',
    // position: 'absolute',
    backgroundColor: 'transparent',
    height: Dimensions.get('window').height,
    width: Dimensions.get('window').width,
  },
});
export default Loader;
