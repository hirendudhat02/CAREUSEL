import React from 'react';
import {View, StyleSheet, Pressable} from 'react-native';

import Modal from 'react-native-modal';
import {moderateScale} from '../../helpers/ResponsiveFonts';
import {colors} from '../../theme';
import Button from '../button/Button';
import Icon from '../icon/Icon';
import Text from '../text/Text';

const AppModal = props => {
  const {
    modalStyle,
    isVisible,
    onBackdropPress,
    modalTitle,
    onPressClose,
    onBackButtonPress,
    details,
    onPressSave,
    onPressCancle,
    savelable,
    canclelable,
    onPressOk,
  } = props;
  // const {t} = useTranslation('common');
  return (
    <Modal
      isVisible={isVisible}
      animationIn={'fadeIn'}
      animationOut={'fadeOut'}
      // animationOutTiming={500}
      // animationInTiming={500}
      onBackdropPress={onBackdropPress}
      onBackButtonPress={onBackButtonPress}>
      <View style={styles.container}>
        {modalStyle === 'success' ? (
          <View style={{alignItems: 'center'}}>
            <Icon
              name={'checkedcircle'}
              style={styles.denideicon}
              onPress={onPressClose}
              height={50}
              size={50}
            />
          </View>
        ) : (
          <View style={styles.header}>
            <Text isBold={true} style={styles.title}>
              {modalTitle}
            </Text>
            <Icon
              name={'close'}
              style={styles.denideicon}
              onPress={onPressClose}
              height={15}
              size={15}
            />
          </View>
        )}

        <Text
          style={[
            styles.details,
            {textAlign: modalStyle === 'success' ? 'center' : null},
          ]}>
          {details}
        </Text>
        {modalStyle === 'success' ? (
          <View style={{alignItems: 'center', marginTop: 25}}>
            <Button
              onPress={onPressOk}
              label={'Close'}
              lableStyle={{fontSize: 15, paddingHorizontal: 15}}
            />
          </View>
        ) : (
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'flex-end',
              marginVertical: 15,
            }}>
            <Button
              onPress={onPressCancle}
              isOutlined
              label={canclelable}
              lableStyle={{fontSize: 15, paddingHorizontal: 15}}
            />
            <View style={{paddingLeft: 20}}>
              <Button
                onPress={onPressSave}
                label={savelable}
                lableStyle={{fontSize: 15, paddingHorizontal: 15}}
              />
            </View>
          </View>
        )}
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: 5,
    overflow: 'hidden',
    maxHeight: '95%',
    padding: 18,
    top: '-15%',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  title: {
    fontSize: moderateScale(19),
    color: colors.charcoal,
  },
  subContainer: {
    padding: 20,
  },
  details: {
    fontSize: moderateScale(17),
    paddingTop: 20,
  },
  denideicon: {margin: 5},
});
export default AppModal;
