import {StyleSheet, Text, useWindowDimensions, View} from 'react-native';
import React from 'react';
import {colors} from '../../../theme';
import {Icon} from '../../../components';
import {moderateScale} from '../../../helpers/ResponsiveFonts';

const Step = ({activeTab, tabs}) => {
  const {width} = useWindowDimensions();

  return (
    <View style={styles.container}>
      {tabs.map((item, index) => {
        const isActive = activeTab === item;
        const isCompleted = activeTab.tab > item.tab;
        return (
          <View key={index} style={styles.itemContainer}>
            <View style={styles.tabContainer(isActive, isCompleted)}>
              {index + 1 === tabs.length ? null : (
                <View style={styles.bar(width - 160, isCompleted)} />
              )}
              {isCompleted ? (
                <Icon name={'Tick'} size={15} />
              ) : (
                <Text style={styles.tab(isCompleted || isActive)}>
                  {item.tab}
                </Text>
              )}
            </View>
            <Text style={styles.title(isActive, isCompleted)}>
              {item.title}
            </Text>
          </View>
        );
      })}
    </View>
  );
};

export default Step;

const styles = StyleSheet.create({
  itemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginHorizontal: 25,
  },
  tabContainer: (isActive, isCompleted) => ({
    backgroundColor: isActive
      ? colors.secoundry
      : isCompleted
      ? colors.primary
      : colors.gray,
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  }),
  tab: isCompleted => ({
    fontSize: moderateScale(16),
    color: isCompleted ? colors.white : colors.grayMedium,
  }),
  bar: (width, isCompleted) => ({
    position: 'absolute',
    backgroundColor: isCompleted ? colors.primary : colors.gray,
    width: width / 2,
    height: 2,
    left: 30,
  }),
  title: (isActive, isCompleted) => ({
    fontSize: moderateScale(12),
    paddingTop: 5,
    color: isActive
      ? colors.secoundry
      : isCompleted
      ? colors.primary
      : colors.grayMedium,
  }),
});
