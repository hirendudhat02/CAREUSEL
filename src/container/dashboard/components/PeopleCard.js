import { StyleSheet, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { Icon, IconInfo, Text } from '../../../components';
import { colors } from '../../../theme';
import { images } from '../../../assets';
import { moderateScale } from '../../../helpers/ResponsiveFonts';
import FastImage from 'react-native-fast-image';
import Regex from '../../../utils/helper';

const PeopleCard = ({ item, index, profilonPress, chatonPress }) => {
  return (
    <View style={styles.container} key={item?._id}>
      <TouchableOpacity
        key={item?._id}
        style={styles.profileImgContainer}
        activeOpacity={0.5}
        onPress={profilonPress}>
        <FastImage
          source={
            item.profilePicUrl === undefined ||
              !Regex.validateURL(item.profilePicUrl)
              ? images.defaultphoto
              : { uri: item.profilePicUrl }
          }
          style={styles.profileImg}
        />
      </TouchableOpacity>
      <View>
        <TouchableOpacity activeOpacity={0.5} onPress={profilonPress}>
          <Text isBold={true} style={styles.name}>
            {item.invitedUserPrefix !== null &&
              item.invitedUserPrefix !== undefined &&
              item.invitedUserPrefix}{' '}
            {item.invitedUserName}
          </Text>
        </TouchableOpacity>

        {item.invitedUserProfession && (
          <IconInfo
            icon="suitcase"
            disabled={true}
            label={item.invitedUserProfession}
          />
        )}
        {item.shortAddress && (
          <IconInfo
            icon="location"
            disabled={true}
            label={item.shortAddress.trim()}
            labelstyle={{ width: '82%' }}
          />
        )}

        <View style={styles.buttonContainer}>
          <Icon
            onPress={chatonPress}
            name={'chatwhite'}
            style={styles.chatIcon}
            height={20}
            size={20}
          />
          <Icon
            onPress={profilonPress}
            name={'profilewhite'}
            style={styles.profileIcon}
            height={20}
            size={20}
          />
        </View>
      </View>
    </View>
  );
};

export default PeopleCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    borderRadius: 7,
    borderWidth: 1,
    borderColor: colors.grayLight,
    paddingHorizontal: 20,
    paddingVertical: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2.5 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
    backgroundColor: colors.white,
  },
  profileImgContainer: {
    paddingEnd: 20,
    paddingTop: 5,
  },
  profileImg: {
    height: 70,
    width: 70,
    borderRadius: 35,
  },
  name: {
    fontSize: moderateScale(17),
    color: colors.secoundry,
    paddingBottom: 5,
    width: '82%',
  },
  buttonContainer: {
    paddingVertical: 5,
    flexDirection: 'row',
  },
  chatIcon: {
    backgroundColor: colors.primary,
    paddingHorizontal: 10,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    tintColor: colors.white,
  },
  profileIcon: {
    backgroundColor: colors.secoundry,
    padding: 10,
    borderRadius: 8,
    marginStart: 12,
    tintColor: colors.white,
  },
});
