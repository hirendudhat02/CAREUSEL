import {Image, StyleSheet, View, TouchableOpacity} from 'react-native';
import React from 'react';
// import {Icon, IconInfo, Text} from '../../../components';
import {colors, fonts} from '../../../theme';
import {Icon, Text} from '../../../components';
import {images} from '../../../assets';
import {moderateScale} from '../../../helpers/ResponsiveFonts';
import {CometChatAvatar} from '../../../cometchat-pro-react-native-ui-kit/CometChatWorkspace/src/components/Shared';
import theme from '../../../cometchat-pro-react-native-ui-kit/CometChatWorkspace/src/resources/theme';

const PeopleCard = ({item, cardpress, cardtype, onPress, index}) => {
  return (
    <View>
      {cardtype !== 'member' ? (
        <TouchableOpacity
          onPress={cardpress}
          style={styles.container}
          activeOpacity={0.5}>
          <View style={styles.profileImgContainer}>
            <Image
              source={
                item.group === true
                  ? images.careuselCircleIcon
                  : {uri: item.profile_photo}
              }
              style={styles.profileImg}
            />
          </View>
          <View style={{flex: 1}}>
            <View style={styles.nameview}>
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.timetxt}>{item.time}</Text>
            </View>

            <View style={styles.buttonContainer}>
              <Text numberOfLines={2} style={styles.detailstxt}>
                {item.details}
              </Text>
              {item.massages && (
                <View style={styles.massageview}>
                  <Text style={styles.massagestxt}>{item.massages}</Text>
                </View>
              )}
            </View>
          </View>
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={[
            styles.memebercontainer,
            {borderTopWidth: index === 0 ? 1 : null},
          ]}
          activeOpacity={0.5}
          onPress={onPress}>
          <View style={styles.memeberImgContainer}>
            {/* <Image
              source={{uri: item.profile_photo}}
              style={styles.memeberprofile}
            /> */}

            <View
              style={{
                flexWrap: 'wrap',
                flexDirection: 'row',
                width: 45,
                height: 45,
                backgroundColor: 'rgba(51,153,255,0.25)',
                borderRadius: 25,
                alignItems: 'center',
              }}>
              <CometChatAvatar
                image={{uri: item.avatar}}
                cornerRadius={35}
                borderColor={theme.color.secondary}
                borderWidth={0}
                name={item.name}
              />
            </View>
            <Text style={styles.memebername}>{item.name}</Text>
          </View>
          <View>
            <Icon name={'nextarrow'} height={25} size={25} disabled={true} />
          </View>
        </TouchableOpacity>
      )}
    </View>
  );
};

export default PeopleCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    paddingVertical: 10,
    marginBottom: 15,
    paddingHorizontal: 5,
  },
  memebercontainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderRadius: 7,
    shadowColor: colors.shadow,
    shadowOffset: {
      width: 0,
      height: 0,
    },
    shadowRadius: 10,
    shadowOpacity: 0.5,
    borderBottomWidth: 1,
    borderColor: colors.grayLight,
    paddingHorizontal: 20,
    paddingVertical: 15,
    alignItems: 'center',
  },
  profileImgContainer: {
    paddingEnd: 15,
    paddingTop: 5,
  },
  memeberImgContainer: {
    paddingEnd: 20,

    flexDirection: 'row',
    alignItems: 'center',
  },
  profileImg: {
    height: 70,
    width: 70,
    borderRadius: 35,
  },
  memeberprofile: {
    height: 40,
    width: 40,
    borderRadius: 35,
  },
  name: {
    fontSize: moderateScale(17),
    color: colors.secoundry,
    paddingBottom: 5,
    fontFamily: fonts.Bold,
    width: '70%',
  },
  memebername: {
    fontSize: moderateScale(18),
    color: colors.charcoal,
    paddingHorizontal: 15,
    fontFamily: fonts.Normal,
  },
  buttonContainer: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailstxt: {
    width: '85%',
    fontSize: moderateScale(14),
    fontFamily: fonts.Normal,
    color: colors.charcoal,
    letterSpacing: 0,
  },
  timetxt: {
    // width: '100%',
    fontSize: moderateScale(13),
    fontFamily: fonts.Normal,
    color: colors.grayMedium,
    letterSpacing: 0,
  },
  massageview: {
    backgroundColor: colors.primary,
    height: 22,
    width: 22,
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 30,
  },
  massagestxt: {
    textAlign: 'center',
    color: colors.white,
    fontSize: moderateScale(11),
    fontFamily: fonts.Normal,
    letterSpacing: 0,
  },
  nameview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
});
