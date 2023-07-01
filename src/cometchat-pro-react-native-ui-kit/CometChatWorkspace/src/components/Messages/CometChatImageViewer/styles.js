import { StyleSheet, Platform } from 'react-native';
import {
  heightRatio,
  widthRatio,
  deviceHeight,
  deviceWidth,
} from '../../../utils/consts';

export default StyleSheet.create({
  outerContainer: { flexGrow: 1, backgroundColor: 'rgba(0,0,0,0.7)' },
  mainContainer: {
    marginVertical: Platform.OS === 'ios' ? 10 : 15,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    width: '80%',
  },
  bottomSheetContainer: {
    backgroundColor: 'white',
    height: deviceHeight,
    borderTopLeftRadius: 15,
    borderTopRightRadius: 15,
    paddingVertical: 15,
  },
  crossImgContainer: {
    alignSelf: 'flex-end',
    marginRight: 20,
    marginTop: Platform.OS === "ios" ? 30 : 20,
    padding: 5
  },
  crossImg: {
    height: 30 * heightRatio,
    width: 30 * widthRatio,
  },
  outerImageContainer: {
    // backgroundColor: 'red',
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
    // marginTop: 10
  },
  imageStyles: {
    width: deviceWidth,
    height: deviceHeight / 1.2,
  },
});
