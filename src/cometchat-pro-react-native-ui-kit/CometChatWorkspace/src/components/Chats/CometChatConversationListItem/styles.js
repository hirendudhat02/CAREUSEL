import { StyleSheet } from 'react-native';
import { widthRatio } from '../../../utils/consts';
import theme from '../../../resources/theme';
import { colors, fonts } from '../../../../../../theme';
import { moderateScale } from '../../../../../../helpers/ResponsiveFonts';

export default StyleSheet.create({
  listItem: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    // paddingVertical: 10,
    height: 85,
    paddingHorizontal: 15,
    justifyContent: 'center',
    marginBottom: 15,
    borderRadius: 7,
    borderWidth: 1,
    borderColor: colors.grayLight,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2.5 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 4,
    backgroundColor: colors.white,
  },
  avatarStyle: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: 44,
    height: 44,
    marginRight: 15 * widthRatio,
    justifyContent: 'center',
    borderWidth: 0.5,
  },
  itemDetailsContainer: {
    flex: 1,
    marginLeft: 15,
    justifyContent: 'center',
    alignItems: 'center',
    color: theme.color.primary,
  },
  itemLastMsgTimeStyle: {
    fontSize: 15,
    fontWeight: '400',
    maxWidth: '88%',
    color: '#333333',
    fontFamily: fonts.Normal,
    lineHeight: 19,
  },
  itemNameStyle: {
    fontSize: 18,
    fontWeight: '600',
    width: '60%',
    color: '#3a4d8f',
    marginBottom: 2,
    fontFamily: fonts.Bold,
  },
  itemMsgStyle: {
    width: '80%',
  },
  itemRowStyle: {
    width: '20%',
    alignItems: 'center',
  },
  itemLastMsgStyle: {
    width: '40%',
    alignItems: 'flex-end',
    color: "#575757",
    fontFamily: fonts.Normal,
  },
  itemThumbnailStyle: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: 52,
    height: 52,
    backgroundColor: 'rgba(51,153,255,0.25)',
    borderRadius: 70,
    // borderStyle: "solid"
  },
});
