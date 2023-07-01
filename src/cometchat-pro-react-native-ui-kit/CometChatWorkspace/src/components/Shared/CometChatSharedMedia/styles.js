import { StyleSheet, Dimensions } from 'react-native';
import { moderateScale } from '../../../../../../helpers/ResponsiveFonts';
import { fonts } from '../../../../../../theme';
import theme from '../../../resources/theme';

const screenWidth = Dimensions.get('window').width;

export default StyleSheet.create({
  sectionStyle: {
    width: '100%',
    alignSelf: 'center',
    height: '100%',
    flex: 1,
  },
  sectionHeaderStyle: {
    marginTop: 10,
    width: '100%',
    fontSize: 18,
    fontWeight: '500',
    lineHeight: 20,
    fontFamily: fonts.SemiBold,
    paddingLeft: moderateScale(15),
  },
  sectionContentStyle: {
    flexGrow: 1,
    width: '100%',
    marginVertical: 6,
    flexDirection: 'column',
    // paddingBottom: 20,
  },
  mediaBtnStyle: {
    backgroundColor: theme.backgroundColor.white,
    width: '100%',
    marginVertical: 6,
    flexDirection: 'row',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 5,
      height: 5,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  buttonTextStyle: {
    fontSize: 15,
    fontWeight: '500',
    lineHeight: 18,
    textAlign: 'center',
    paddingVertical: 8,
    fontFamily: fonts.SemiBold,
  },
  activeButtonStyle: {
    width: '33.33%',
    alignSelf: 'flex-start',
    padding: 5,
    textAlign: 'center',
    borderBottomColor: theme.color.secoundry,
    borderBottomWidth: 3,
    fontFamily: fonts.SemiBold,
  },
  buttonStyle: {
    width: '33.33%',
    alignSelf: 'flex-start',
    padding: 5,
    textAlign: 'center',
    color: theme.color.primary,
    fontFamily: fonts.SemiBold,
  },
  mediaItemStyle: {
    justifyContent: 'center',
    flexGrow: 1,
    height: '100%',
    marginTop: 10,
  },
  mediaItemColumnStyle: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    padding: 10,
    flexGrow: 1,
  },
  itemStyle: {
    borderRadius: 8,
    overflow: 'hidden',
    textAlign: 'center',
    margin: 10
    // flexDirection: 'column',
  },
  imageStyle: {
    width: (screenWidth - 40) / 2,
    height: 128,
  },
  videoPlayerStyle: {
    height: '100%',
    width: '100%',
    borderRadius: 12,
    alignSelf: 'center',
  },
  videoStyle: {
    borderRadius: 8,
    width: (screenWidth - 40) / 2,
    height: 128,
    // borderRadius: 12,
    backgroundColor: '#f2f2f2',
    margin: 10
  },
  fileItemStyle: {
    width: (screenWidth - 40) / 2,
    height: 100,
    borderRadius: 10,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
    margin: 10
  },
  fileStyle: {
    maxWidth: '100%',
    maxHeight: '100%',
    marginTop: 15,
    fontSize: 13,
    textAlign: 'left',
    fontFamily: fonts.SemiBold,
  },
  separator: {
    width: 1,
    height: 18,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  emptyComponentContainerStyle: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    flexGrow: 1,
  },
  emptyComponentStyle: {
    fontSize: 22,
    color: '#333333',
    fontWeight: '600',
    fontFamily: fonts.SemiBold,
    paddingTop: 20,
  },
});
