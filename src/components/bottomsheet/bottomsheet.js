import {StyleSheet, TouchableOpacity, View} from 'react-native';
import React from 'react';
import {colors} from '../../theme';
import RBSheet from 'react-native-raw-bottom-sheet';
import Button from '../button/Button';
import Text from '../text/Text';
import {images} from '../../assets';
import {moderateScale} from '../../helpers/ResponsiveFonts';
import FastImage from 'react-native-fast-image';
const bottomsheet = ({
  sheettype,
  refRBSheet,
  children,
  toponpress,
  top,
  atoZonpress,
  atoZ,
  ztoAonpress,
  ztoA,
  client,
  expert,
  clientonpress,
  expertonpress,
  clearonpress,
  doneonpress,
  galleryonpress,
  cameraonpress,
  Documentpress,
  addDocument,
  disabled,
  ...props
}) => {
  return (
    <View>
      <RBSheet
        ref={refRBSheet}
        closeOnDragDown={true}
        height={sheettype === 'filter' || sheettype === 'profile' ? 240 : 280}
        customStyles={{
          container: {
            borderColor: colors.shadow,
            borderWidth: 1,
            borderTopLeftRadius: 30,
            borderTopRightRadius: 30,
          },
          wrapper: {
            backgroundColor: 'rgba(0, 0, 0, 0.4)',
          },
          draggableIcon: {
            width: 150,
            marginTop: 15,
          },
        }}>
        {sheettype === 'filter' ? (
          <View style={{marginHorizontal: 30, marginTop: 10}}>
            <Text style={styles.shorttxt} isBold>
              Filter
            </Text>
            <View style={styles.redioview}>
              {/* <View style={styles.rediobuttomview}>
                <Text style={styles.User} isSemiBold>
                  User type
                </Text>
              </View> */}

              <TouchableOpacity
                style={styles.rediobuttomview}
                activeOpacity={0.5}
                onPress={clientonpress}>
                <Text style={styles.opationtxt}>Friends</Text>

                <FastImage
                  source={
                    images[client === true ? 'redioactive' : 'radiodeactive']
                  }
                  style={{width: 22, height: 22}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rediobuttomview}
                activeOpacity={0.5}
                onPress={expertonpress}>
                <Text style={styles.opationtxt}>Experts</Text>

                <FastImage
                  source={
                    images[expert === true ? 'redioactive' : 'radiodeactive']
                  }
                  style={{width: 22, height: 22}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.sheetbuttonview}>
              <Button
                disabled={(client || expert) === true ? false : true}
                lableStyle={{fontSize: 15, paddingHorizontal: 15}}
                isOutlined
                onPress={clearonpress}
                label={'Clear'}
              />

              <Button
                disabled={(client || expert) === true ? false : true}
                lableStyle={{fontSize: 15, paddingHorizontal: 15}}
                onPress={doneonpress}
                label={'Filter'}
              />
            </View>
          </View>
        ) : sheettype === 'profile' ? (
          <View style={{marginHorizontal: 30}}>
            <Text style={[styles.shorttxt, {textAlign: 'center'}]} isBold>
              Select From
            </Text>
            {addDocument === true ? (
              <View style={styles.photobuttonview}>
                <View style={{paddingVertical: 10}}>
                  <Button onPress={cameraonpress} label={'Camera'} />
                </View>
                <Button onPress={galleryonpress} label={'Gallery'} />

                <View style={{paddingVertical: 10}}>
                  <Button onPress={Documentpress} label={'Document'} />
                </View>
              </View>
            ) : (
              <View style={styles.photobuttonview}>
                <View style={{paddingVertical: 20}}>
                  <Button onPress={cameraonpress} label={'Camera'} />
                </View>
                <Button onPress={galleryonpress} label={'Gallery'} />
              </View>
            )}
          </View>
        ) : (
          <View style={{marginHorizontal: 30, marginTop: 10}}>
            <Text style={styles.shorttxt} isBold>
              Sort by
            </Text>
            <View style={styles.redioview}>
              <TouchableOpacity
                style={styles.rediobuttomview}
                activeOpacity={0.5}
                onPress={toponpress}>
                <Text style={styles.opationtxt}>Latest on Top</Text>
                <FastImage
                  source={
                    images[top === true ? 'redioactive' : 'radiodeactive']
                  }
                  style={{width: 22, height: 22}}
                  resizeMode="contain"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.rediobuttomview}
                activeOpacity={0.5}
                onPress={atoZonpress}>
                <Text style={styles.opationtxt}>A to Z</Text>
                <FastImage
                  source={
                    images[atoZ === true ? 'redioactive' : 'radiodeactive']
                  }
                  style={{width: 22, height: 22}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.rediobuttomview}
                activeOpacity={0.5}
                onPress={ztoAonpress}>
                <Text style={styles.opationtxt}>Z to A</Text>

                <FastImage
                  source={
                    images[ztoA === true ? 'redioactive' : 'radiodeactive']
                  }
                  style={{width: 22, height: 22}}
                  resizeMode="contain"
                />
              </TouchableOpacity>
            </View>
            <View style={styles.sheetbuttonview}>
              <Button
                lableStyle={{
                  fontSize: moderateScale(15),
                  paddingHorizontal: 15,
                }}
                isOutlined
                onPress={clearonpress}
                label={'Clear'}
              />

              <Button
                lableStyle={{
                  fontSize: moderateScale(15),
                  paddingHorizontal: 15,
                }}
                disabled={disabled}
                onPress={doneonpress}
                label={'Sort'}
              />
            </View>
          </View>
        )}
      </RBSheet>
    </View>
  );
};

export default bottomsheet;

const styles = StyleSheet.create({
  redioview: {
    marginTop: 5,
  },
  shorttxt: {
    fontSize: moderateScale(16),
  },
  opationtxt: {
    fontSize: moderateScale(15),
    paddingVertical: 5,
  },
  sheetbuttonview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-evenly',
    marginHorizontal: 50,
    marginTop: 15,
  },
  photobuttonview: {
    paddingVertical: 10,
  },
  rediobuttomview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 5,
  },
  User: {
    fontSize: moderateScale(18),
  },
});
