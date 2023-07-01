import React, {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  FlatList,
  ScrollView,
  StatusBar,
  StyleSheet,
  useWindowDimensions,
  View,
} from 'react-native';
import {Text, Watermark} from '../../../components';
import {images} from '../../../assets';
import Button from '../../../components/button/Button';
import {colors, fonts} from '../../../theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {moderateScale} from '../../../helpers/ResponsiveFonts';
import FastImage from 'react-native-fast-image';

const slides = [
  {
    image: images.Onboarding1,
    msg: 'Real-time, direct communication \n with your health and wellness experts',
    dot: [
      {
        index: 0,
        point: 'Convenient communication whenever, wherever',
      },
      {
        index: 1,
        point: 'Clarifications and check-ins to keep you track',
      },
      {
        index: 2,
        point: 'Avoid extra in-person visits and calls',
      },
    ],
  },
  {
    image: images.Onboarding2,
    msg: 'Link your health and wellness \n experts together',
    dot: [
      {
        index: 0,
        point: 'Customized care across all your experts',
      },
      {
        index: 1,
        point: 'No more being in the middle',
      },
      {
        index: 2,
        point: 'Avoid miscommunications or conflicting guidance',
      },
    ],
  },
  {
    image: images.Onboarding3,
    msg: 'Security for your most sensitive \n conversations',
    dot: [
      {
        index: 0,
        point: 'Feel safe to chat',
      },
      {
        index: 1,
        point: 'Security across all experts, all the time',
      },
      {
        index: 2,
        point: 'Own your relationships',
      },
    ],
  },
];

const OnBoarding = props => {
  const [data, setData] = useState(slides);
  const scrollref = useRef();
  useEffect(() => {
    const unsubscribe = props.navigation.addListener('focus', () => {
      scrollref.current.scrollToIndex({index: 0});
    });
    return unsubscribe;
  }, [props.navigation]);

  const {width, height} = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const startedPushNavigation = () => {
    props.navigation.push('PushNotification');
  };

  const renderItem = ({item, index}) => {
    return (
      <View style={styles.itemContainer}>
        <FastImage
          source={item.image}
          style={{width: width / 1, height: height / 3.5}}
          resizeMode="contain"
        />
        <Text isSemiBold style={styles.directtxt}>
          {item.msg}
        </Text>
        <View style={{paddingVertical: 15, width: '85%'}}>
          {item.dot.map((dotitem, dotindex) => {
            return (
              <View
                style={{
                  marginVertical: 7,
                  flexDirection: 'row',
                }}>
                <View style={styles.dotview} />
                <Text isSemiBold style={styles.dynamictxt}>
                  {dotitem.point}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={styles.sliderbutton}>
          {item.dot.map((dotitem, dotindex) => {
            return (
              <View
                style={[
                  styles.redioview,
                  {
                    backgroundColor:
                      index === dotindex ? colors.primary : colors.white,
                  },
                ]}
              />
            );
          })}
        </View>
        {index === 2 ? (
          <View style={{marginVertical: 50}}>
            <Button
              onPress={() => startedPushNavigation()}
              label={'Get Started'}
            />
          </View>
        ) : null}
      </View>
    );
  };

  return (
    <View
      style={[
        styles.container,
        {
          paddingTop: insets.top,
          paddingLeft: insets.left,
          paddingRight: insets.right,
        },
      ]}>
      <Watermark />
      <ScrollView
        bounces={false}
        nestedScrollEnabled
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}>
        <StatusBar barStyle={'dark-content'} backgroundColor={colors.white} />
        <Text style={styles.maintxt}>Welcome to Careusel!</Text>
        <FlatList
          data={data}
          ref={scrollref}
          renderItem={renderItem}
          pagingEnabled
          horizontal
          scrollEnabled
          showsHorizontalScrollIndicator={false}
        />
      </ScrollView>
    </View>
  );
};

export default OnBoarding;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  itemContainer: {
    alignItems: 'center',
    marginTop: 50,
    height: '100%',
    width: Dimensions.get('window').width,
  },
  maintxt: {
    fontSize: moderateScale(24),
    textAlign: 'center',
    fontFamily: fonts.Bold,
    fontWeight: '700',
    marginTop: 50,
    paddingHorizontal: 5,
  },
  sliderbutton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 30,
  },
  directtxt: {
    marginTop: 50,
    paddingHorizontal: 15,
    textAlign: 'center',
    fontSize: moderateScale(18),
  },
  dynamictxt: {
    textAlign: 'left',
    fontSize: moderateScale(15),
  },
  redioview: {
    height: 15,
    width: 15,
    borderRadius: 10,
    borderColor: colors.primary,
    borderWidth: 2,
    marginHorizontal: 8,
  },
  dotview: {
    height: 8,
    width: 8,
    borderRadius: 30,
    backgroundColor: colors.secoundry,
    margin: 10,
  },
});
