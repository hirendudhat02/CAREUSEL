import React from 'react';
import {moderateScale, verticalScale} from '../../helpers/ResponsiveFonts';
import {
  Text,
  View,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  FlatList,
} from 'react-native';
import TextInputWithLabelComponent from '../input/Input';
import {colors, fonts} from '../../theme';

const AutoCompleteInput = props => {
  let {
    listname = 'name',
    onPress,
    show,
    onChange,
    placeholder,
    label,
    list = [],
    load = false,
    inputvalue = '',
  } = props;

  return (
    <View style={styles.container}>
      <TextInputWithLabelComponent
        label={label}
        value={inputvalue}
        placeholder={placeholder}
        multiline
        numberOfLines={4}
        maxLength={120}
        style={styles.address}
        onChangeText={text => onChange(text)}
      />
      {load && <ActivityIndicator style={styles.indicator} />}

      {show && (
        <View
          style={[
            styles.dropDownContainer,
            {
              height: list.length <= 2 ? moderateScale(40) : moderateScale(170),
            },
          ]}>
          <FlatList
            data={list}
            showsVerticalScrollIndicator={false}
            nestedScrollEnabled={true}
            renderItem={({item, index}) => {
              return (
                <TouchableOpacity
                  onPress={() => {
                    onPress(item.place_id, item.description);
                  }}>
                  <View
                    pointerEvents="none"
                    style={[
                      styles.dropDownItem,
                      {borderBottomWidth: index === list.length - 1 ? 0 : 1},
                    ]}>
                    <Text style={styles.itemText}>{item[listname]}</Text>
                  </View>
                </TouchableOpacity>
              );
            }}
          />
        </View>
      )}
    </View>
  );
};

export default AutoCompleteInput;

const styles = StyleSheet.create({
  container: {
    // zIndex: ,

    position: 'relative',
    flexGrow: 1,
  },
  indicator: {
    position: 'absolute',
    bottom: 20,
    right: 10,
  },
  dropDownContainer: {
    borderRadius: 10,
    backgroundColor: 'white',
    width: '100%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 3,
    },
    flexGrow: 1,
    // marginTop: Platform.OS === 'ios' ? moderateScale(20) : moderateScale(10),
    marginTop: moderateScale(-5),

    shadowOpacity: 0.5,
    shadowRadius: 4.65,
    elevation: 7,
    position: 'relative',
    zIndex: 10,
    borderColor: 'yellow',
    // top: 150,
  },
  dropDownItem: {
    borderBottomColor: colors.gray,
    paddingHorizontal: moderateScale(5),
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
  },
  itemText: {
    width: '90%',
    textAlignVertical: 'center',
    fontSize: moderateScale(12),
    fontWeight: '500',
    fontFamily: fonts.Normal,
    paddingVertical: verticalScale(10),
    paddingLeft: moderateScale(10),
    color: colors.black,
  },
  address: {
    height: 100,
    textAlignVertical: 'top',
  },
});
