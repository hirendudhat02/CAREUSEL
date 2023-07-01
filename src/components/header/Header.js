import {Image, StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import Text from '../text/Text';
import {colors} from '../../theme';
import Icon from '../icon/Icon';
import {images} from '../../assets';
import {moderateScale} from '../../helpers/ResponsiveFonts';

const Header = ({
  title,
  iconLeft,
  iconRight,
  onIconLeftPress,
  onIconRightPress,
  Containertype,
  onimagePress,
  massagetype,
  image,
  iconextra,
  onIconExtraPress,
}) => {
  return (
    <View style={styles.container}>
      {iconLeft ? (
        <Icon
          name={iconLeft}
          size={13}
          onPress={onIconLeftPress}
          style={styles.lefticon}
        />
      ) : (
        <View style={styles.emptyIcon} />
      )}
      {/** To Mange title in middle */}
      {/* <View style={{width: 20}} /> */}
      {Containertype === 'massage' ? (
        <TouchableOpacity
          style={styles.massageContainer}
          onPress={onimagePress}>
          <Image
            source={image ? {uri: image} : images.defaultphoto}
            style={styles.profileImg}
          />
          <Text style={styles.title} isBold={true}>
            {title}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.titleContainer}>
          <Text style={styles.title} isBold={true}>
            {title}
          </Text>
        </View>
      )}
      {title === 'Connections' ? (
        <>
          {iconRight ? (
            <>
              <View style={{paddingRight: 10, position: 'absolute', right: 40}}>
                <Icon
                  name={iconextra}
                  size={18}
                  onPress={onIconExtraPress}
                  style={styles.righticon}
                />
              </View>
              <Icon
                name={iconRight}
                size={18}
                onPress={onIconRightPress}
                style={styles.righticon}
              />
            </>
          ) : (
            <View style={styles.emptyIcon} />
          )}
        </>
      ) : (
        <>
          {iconRight ? (
            <Icon
              name={iconRight}
              size={18}
              onPress={onIconRightPress}
              style={styles.righticon}
            />
          ) : (
            <View style={styles.emptyIcon} />
          )}
        </>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  title: {
    fontSize: moderateScale(22),
    color: colors.white,
  },
  container: {
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: colors.primary,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
  },
  titleContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  massageContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  emptyIcon: {
    width: 13,
    height: 13,
  },
  profileImg: {
    height: 38,
    width: 38,
    borderRadius: 40,
    marginRight: 15,
    borderWidth: 2,
    borderColor: colors.white,
  },
  lefticon: {
    padding: 5,
  },
  righticon: {
    padding: 5,
  },
});
