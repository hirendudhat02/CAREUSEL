import {StyleSheet} from 'react-native';
import {heightRatio} from '../../../utils/consts';
import theme from '../../../resources/theme';
import {fonts} from '../../../../../../theme';
import {verticalScale} from '../../../../../../helpers/ResponsiveFonts';

export default StyleSheet.create({
  // bottomSheetContainer: {flexGrow: 1, backgroundColor: 'rgba(0,0,0,0.7)'},
  mainContainer: {
    flexDirection: 'row',
    padding: 10,

    // paddingHorizontal: 10,
    alignItems: 'center',
  },
  plusCircleContainer: {
    marginLeft: 10,
    backgroundColor: '#3a4d8f',
    padding: 10,
    borderRadius: 20,
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  fullFlex: {flexGrow: 1},
  chatComposerStyle: {
    padding: 14,
    backgroundColor: theme.backgroundColor.white,
    zIndex: 1,
    flexDirection: 'row',
  },
  composerInputStyle: {
    padding: 14,
    flex: 1,
    zIndex: 1,
    flexDirection: 'row',
  },
  inputInnerStyle: {
    flex: 1,

    borderRadius: 8,
    borderWidth: 1,
    borderColor: theme.borderColor.primary,
    backgroundColor: theme.backgroundColor.white,
    flexDirection: 'column',
    width: '100%',
  },
  messageInputStyle: {
    color: 'black',
    fontSize: 15,
    padding: 10,
    backgroundColor: 'rgba(0,0,0,0.05)',
    borderRadius: 20,
    flexGrow: 1,
    height: 40,
  },
  inputStickyStyle: {
    padding: 7,
    height: 35,
    borderTopWidth: 1,
    borderColor: theme.borderColor.primary,
    backgroundColor: theme.backgroundColor.grey,
    justifyContent: 'space-between',
  },
  reactionDetailsContainer: {
    backgroundColor: 'white',
    paddingVertical: 20,
    borderRadius: 20,
    minHeight: 200,
    paddingBottom: 300,
  },
  actionButtonContainer: {
    flexDirection: 'row',
    height: 50 * heightRatio,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  header: {
    width: '10%',
    height: 5,
    borderRadius: 10,
    marginBottom: 10,
    alignSelf: 'center',
    backgroundColor: theme.color.darkSecondary,
  },
  reactionBtnStyle: {
    marginLeft: 10,
  },
  sendButtonStyle: {
    marginLeft: 10,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#cc9933',
    padding: 10,
    borderRadius: 20,
  },
  blockedPreviewContainer: {
    width: '100%',
    alignSelf: 'center',
    // borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    // opacity: 0.7,
  },
  blockedPreviewText1: {fontSize: 20, fontWeight: '800'},
  blockedPreviewText2: {
    textAlign: 'center',
    // marginTop: 5,
    fontFamily: fonts.SemiBold,
    fontSize: 18,
  },
  editPreviewContainerStyle: {
    padding: 7,
    paddingHorizontal: 12,
    borderTopWidth: 1,
    borderColor: 'black',
  },
  previewHeadingContainer: {
    borderLeftWidth: 3,
    paddingLeft: 8,
  },
  previewHeadingStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  previewTextStyle: {
    fontSize: 16,
    fontWeight: '600',
  },
});
