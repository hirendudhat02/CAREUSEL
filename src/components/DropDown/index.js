import React from 'react';
import {View, StyleSheet, Platform} from 'react-native';
import SelectDropdown from 'react-native-select-dropdown';
import {images} from '../../assets';
import {moderateScale, verticalScale} from '../../helpers/ResponsiveFonts';
import {colors, fonts} from '../../theme';
import Text from '../text/Text';
import FastImage from 'react-native-fast-image';

const DropDownComponent = props => {
  const {
    options,
    placeholder,
    label,
    onSelect,
    selected,
    returnType,
    onDropDownFocus,
    disableDropDown,
    top,
    dropdownRef,
  } = props;

  return (
    <View style={{marginTop: 10}}>
      {label && (
        <Text isBold={true} style={styles.label}>
          {label}
        </Text>
      )}
      <View style={styles.dropdownView}>
        <SelectDropdown
          data={options}
          ref={dropdownRef}
          onFocus={onDropDownFocus}
          disabled={disableDropDown}
          onSelect={(selectedItem, index) => onSelect(selectedItem)}
          defaultButtonText={selected ? selected : placeholder}
          buttonStyle={styles.dropdownSelect}
          buttonTextStyle={
            selected !== ''
              ? styles.activeTextColor
              : styles.dropdownButtonTextStyle
          }
          buttonTextAfterSelection={(selectedItem, index) => {
            var itemType = typeof selectedItem;
            if (itemType === 'object') {
              if (returnType === 'country') {
                return selectedItem.countryName;
              } else if (returnType === 'patient') {
                return selectedItem.value;
              } else if (returnType === 'question') {
                return selectedItem.response;
              } else if (returnType === 'healthcare') {
                return selectedItem.name;
              } else if (returnType === 'provider') {
                return selectedItem.firstName + ' ' + selectedItem?.lastName;
              } else if (returnType === 'category') {
                return selectedItem?.categoryName;
              } else if (returnType === 'subcategory') {
                return selectedItem?.subCategoryName;
              } else if (returnType === 'specialization') {
                return selectedItem?.specializationName;
              } else {
                return selectedItem.stateName;
              }
            } else {
              return selectedItem;
            }
          }}
          renderDropdownIcon={() => {
            return (
              <FastImage
                source={images.arrowdown}
                style={styles.icon}
                resizeMode="contain"
              />
            );
          }}
          dropdownStyle={styles.dropdown2DropdownStyle}
          dropdownIconPosition={'right'}
          rowTextForSelection={(item, index) => {
            var itemType = typeof item;
            if (itemType === 'object') {
              if (returnType === 'country') {
                return item.countryName;
              } else if (returnType === 'patient') {
                return item.value;
              } else if (returnType === 'question') {
                return item.response;
              } else if (returnType === 'healthcare') {
                return item.name;
              } else if (returnType === 'provider') {
                return item?.firstName + ' ' + item?.lastName;
              } else if (returnType === 'category') {
                return item?.categoryName;
              } else if (returnType === 'subcategory') {
                return item?.subCategoryName;
              } else if (returnType === 'specialization') {
                return item?.specializationName;
              } else {
                return item.stateName;
              }
            } else {
              return item;
            }
          }}
          rowStyle={styles.dropdownRowStyle}
          rowTextStyle={styles.dropdownRowTxtStyle}
        />
      </View>
    </View>
  );
};

export default DropDownComponent;

const styles = StyleSheet.create({
  container: {
    // marginTop: verticalScale(20),
  },
  dropdownView: {
    paddingVertical: 1,
    borderRadius: 7,
    borderColor: colors.grayLight,
    borderWidth: 2,
    backgroundColor: colors.white,
    flexDirection: 'row',
    shadowColor: '#ccc',
    shadowOffset: {width: 0, height: 2.5},
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 5,
  },
  label: {
    paddingBottom: 10,
  },
  dropdownSelect: {
    width: '100%',
    height: Platform.OS === 'ios' ? 45 : 50,
    backgroundColor: 'transparent',
  },
  icon: {
    height: 20,
    width: 20,
    left: 10,
    tintColor: colors.grayMedium,
  },
  dropdownButtonTextStyle: {
    color: colors.grayLight,
    fontFamily: fonts.Normal,
    fontSize: moderateScale(16),
    fontWeight: '500',
    letterSpacing: 0.03,
    // lineHeight: 17,
    textAlign: 'left',
  },
  activeTextColor: {
    color: colors.charcoal,
    fontFamily: fonts.SemiBold,
    fontSize: moderateScale(15),
    letterSpacing: 0.03,
    textAlign: 'left',
  },
  dropdownRowStyle: {
    backgroundColor: '#EFEFEF',
    borderBottomColor: '#C5C5C5',
  },
  dropdownRowTxtStyle: {
    color: colors.charcoal,
    fontFamily: fonts.Bold,
    fontSize: moderateScale(14),
    letterSpacing: 0.03,
    textAlign: 'left',
  },
  calenderView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textinput: {
    paddingLeft: 10,
    color: colors.charcoal,
    fontFamily: fonts.Normal,
    fontSize: moderateScale(16),
    fontWeight: '700',
  },
  calendarIcon: {
    width: '17%',
    alignItems: 'flex-end',
  },
  inputValuePosition: {
    paddingStart: 16.23,
    paddingVertical: 15.5,
  },
  inputLabel: {
    color: colors.charcoal,
    fontFamily: fonts.Normal,
    fontSize: moderateScale(13),
    fontWeight: '400',
    letterSpacing: 0.03,
    lineHeight: 17,
  },
  input: {
    color: colors.charcoal,
    fontFamily: fonts.Normal,
    fontSize: moderateScale(15),
    fontWeight: '700',
    letterSpacing: 0.02,
    lineHeight: 19,
  },
  dropdown2DropdownStyle: {
    borderRadius: 5,
  },
});
