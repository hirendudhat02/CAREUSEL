import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Text } from '../../../components';
import { colors } from '../../../theme';
import { images } from '../../../assets';
import { moderateScale } from '../../../helpers/ResponsiveFonts';
import FastImage from 'react-native-fast-image';
import Regex from '../../../utils/helper';

const InviteCard = props => {
  return (
    <View style={styles.container}>
      <View style={{ flexDirection: 'row', flex: 1 }}>
        <TouchableOpacity
          key={props.index}
          onPress={props.profileonPress}
          activeOpacity={0.5}
          style={styles.profileImgContainer}>
          <FastImage
            source={
              props.item.profilePicUrl === undefined ||
                !Regex.validateURL(props.item.profilePicUrl)
                ? images.defaultphoto
                : { uri: props.item.profilePicUrl }
            }
            style={styles.profileImg}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={props.profileonPress}
          activeOpacity={0.5}
          style={{ flex: 1 }}>
          <Text isBold={true} style={styles.name}>
            {props.item.fullName}
          </Text>
        </TouchableOpacity>
      </View>
      <View style={{ flexDirection: 'row', paddingLeft: 20 }}>
        {props.item?.userType === 'expert' ? (
          <View style={styles.expertview}>
            <Text style={styles.expert}>Expert</Text>
          </View>
        ) : null}
        <TouchableOpacity
          activeOpacity={0.5}
          onPress={props.iconPress}
          style={styles.checkview}>
          <FastImage
            source={
              props.item.checked === false || props.item.checked === undefined
                ? images.unchecked
                : images.checked
            }
            style={{ width: 25, height: 25 }}
          />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default InviteCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: colors.white,
    borderRadius: 7,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 10,
    shadowOpacity: 0.5,
    borderWidth: 1,
    borderColor: colors.grayLight,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 15,
    justifyContent: 'space-between',
  },
  profileImgContainer: {
    paddingEnd: 20,
    paddingTop: 5,
  },
  profileImg: {
    height: 50,
    width: 50,
    borderRadius: 35,
  },
  name: {
    flex: 1,
    fontSize: moderateScale(17),
    color: colors.secoundry,
    paddingBottom: 5,
    textAlign: 'left',
  },
  buttonContainer: {
    paddingVertical: 5,
    flexDirection: 'row',
  },
  expert: {
    fontSize: moderateScale(13),
    borderWidth: 1,
    color: colors.primary,
    borderColor: colors.primary,
    paddingVertical: 0,
    paddingHorizontal: 10,
    borderRadius: 5,
  },

  expertview: {
    right: 12,
    alignItems: 'center',
  },
  checkview: {},
});
