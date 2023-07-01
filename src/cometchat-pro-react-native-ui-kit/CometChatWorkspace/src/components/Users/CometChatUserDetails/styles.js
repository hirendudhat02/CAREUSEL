import {Platform, StyleSheet} from 'react-native';
import {heightRatio, widthRatio, deviceHeight} from '../../../utils/consts';
import theme from '../../../resources/theme';
import {
  verticalScale,
  moderateScale,
} from '../../../../../../helpers/ResponsiveFonts';
import {fonts} from '../../../../../../theme';
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.yellow,
    minHeight: deviceHeight,
  },
  itemLinkStyle: {
    fontSize: 15,
    lineHeight: 20,
    fontWeight: '600',
  },
  sectionHeaderStyle: {
    margin: 0,
    width: '100%',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 20,
    textTransform: 'uppercase',
  },
  optionsContainer: {flexGrow: 1},
  blockContainer: {width: '100%'},
  blockText: {
    width: '100%',
    marginVertical: 6,
    paddingBottom: 8,
  },
  headerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 5 * heightRatio,
    paddingHorizontal: 5 * widthRatio,
    borderBottomWidth: 1,
  },
  headerTitleStyle: {
    fontWeight: '700',
    fontSize: 20,
    color: '#fff',
    textAlign: 'center',
    fontFamily: fonts.Bold,
    paddingLeft: moderateScale(120),
  },
  reactionDetailsContainer: {
    backgroundColor: 'white',
    flexGrow: 1,
    minHeight: deviceHeight,
  },
  avatarStyle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(51,153,255,0.25)',
  },
  userName: {
    fontSize: 16 * heightRatio,
    color: theme.color.secoundry,
    fontWeight: 'bold',
    fontFamily: fonts.Bold,
  },
  statusText: {
    fontSize: 14,
    color: theme.color.primary,
  },
  userDetailContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  userDetail: {
    paddingLeft: 15,
    justifyContent: 'center',
    height: 48,
    width: '100%',
  },
});
