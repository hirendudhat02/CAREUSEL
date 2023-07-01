import { Dimensions, Platform, StyleSheet } from 'react-native';
import { deviceHeight, heightRatio, widthRatio } from '../../../utils/consts';
import theme from '../../../resources/theme';
import { fonts } from '../../../../../../theme';
import { moderateScale } from '../../../../../../helpers/ResponsiveFonts';
export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.yellow,
    // paddingTop: Platform.OS === 'ios' ? moderateScale(40) : 0,
    minHeight: deviceHeight,
  },
  modalWrapper: {
    backgroundColor: 'transparent',
  },
  modalContainer: {
    backgroundColor: 'white',
    width: '90%',
    paddingVertical: 20,
    borderRadius: 30,
    elevation: 1,
  },
  itemLinkStyle: {
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '600',
    marginVertical: 4,
    color: theme.color.primary,
  },
  fullWidth: { width: '100%' },
  listItemContainer: { width: '100%', marginVertical: 6 },
  sectionHeaderStyle: {
    margin: 0,
    width: '100%',
    fontSize: 12,
    fontWeight: '500',
    lineHeight: 20,
    textTransform: 'uppercase',
    color: theme.color.helpText,
  },
  headerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-start',
    paddingVertical: 5 * heightRatio,
    paddingHorizontal: 8 * widthRatio,
    borderBottomWidth: 1,
  },
  closeIcon: { marginRight: 5 },
  // detailContainer: {padding: 16},
  headerTitleStyle: {
    fontWeight: '700',
    fontSize: 20,
    color: theme.color.white,
    paddingLeft: moderateScale(85),
    fontFamily: fonts.Bold,
  },
  reactionDetailsContainer: {
    backgroundColor: 'white',
    flexGrow: 1,
    overflow: 'hidden',
    minHeight: Dimensions.get('window').height,
  },
  userName: {
    fontSize: 18 * heightRatio,
    color: theme.color.secoundry,
    fontWeight: 'bold',
    fontFamily: fonts.Bold,
  },
  statusText: {
    fontSize: 15,
    color: theme.color.primary,
    fontFamily: fonts.SemiBold,
  },
  avatarStyle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(51,153,255,0.25)',
  },
  groupDetailContainer: {
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  groupDetail: {
    paddingLeft: 8,
    justifyContent: 'center',
    height: 48,
  },
  detailContainer: {
    flexGrow: 1,
  },
  action: { marginLeft: 20, paddingVertical: 15, flexDirection: 'row', alignItems: 'center' },
  actionsText: { fontSize: 20, marginLeft: 10, color: theme.color.secoundry },

});
