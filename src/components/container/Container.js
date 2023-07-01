import {StatusBar, StyleSheet, View} from 'react-native';
import React from 'react';
import {colors} from '../../theme';
import Header from '../header/Header';
import Content from '../content/Content';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
const Container = ({
  icon,
  onIconPress,
  children,
  isLoading,
  title,
  isFailed,
  iconRight,
  iconLeft,
  onIconLeftPress,
  onIconRightPress,
  Containertype,
  onimagePress,
  images,
  massagetype,
  iconextra,
  onIconExtraPress,
  ...props
}) => {
  const insets = useSafeAreaInsets();
  return (
    <>
      <View
        style={[
          styles.container,
          styles.iosStatusBar,
          {
            paddingTop: insets.top,
            paddingLeft: insets.left,
            paddingRight: insets.right,
          },
        ]}>
        <View style={styles.iosStatusBar} />
        <StatusBar
          barStyle={'light-content'}
          backgroundColor={colors.primary}
        />
        <Header
          title={title}
          {...props}
          iconextra={iconextra}
          iconRight={iconRight}
          iconLeft={iconLeft}
          image={images}
          Containertype={Containertype}
          onIconLeftPress={onIconLeftPress}
          onIconRightPress={onIconRightPress}
          onimagePress={onimagePress}
          onIconExtraPress={onIconExtraPress}
          massagetype={massagetype}
        />
        <Content isFailed={isFailed} isLoading={isLoading}>
          {children}
        </Content>
      </View>
    </>
  );
};

export default Container;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  iosStatusBar: {
    backgroundColor: colors.primary,
  },
});
