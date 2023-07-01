import { StyleSheet } from 'react-native';
import { heightRatio, widthRatio } from '../../../utils/consts';
import theme from '../../../resources/theme';
import { fonts } from '../../../../../../theme';
export default StyleSheet.create({
  messageLinkStyle: {
    textDecorationLine: 'underline',
    color: 'blue',
    fontSize: 15,
  },
  container: { marginBottom: 16, marginLeft: 4 },
  innerContainer: { flexDirection: 'row', alignItems: 'flex-start' },
  senderNameStyle: {
    marginBottom: 2,
    // color: theme.color.white,
    // paddingLeft: 8,
  },
  autolinkStyle: { color: theme.color.white, fontSize: 15, fontFamily: fonts.SemiBold },
  messageContainer: { maxWidth: '81%', minWidth: '81%', paddingLeft: 5 },
  linkObjectDescription: {
    fontStyle: 'italic',
    fontSize: 13,
  },
  linkObjectTitle: {
    fontWeight: '700',
  },
  messageWrapperStyle: {
    marginBottom: 0,
    alignSelf: 'flex-start',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: '100%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomRightRadius: 6,
  },
  messageInfoWrapperStyle: {
    flexDirection: 'row',
    justifyContent: 'flex-start',
    marginLeft: 5,
  },
  messagePreviewContainerStyle: {
    borderRadius: 12,
    flex: 1,
  },
  previewImageStyle: {
    height: 150,
    marginVertical: 12,
  },
  previewImageIconStyle: {
    height: 50,
    marginVertical: 12,
  },
  previewDataStyle: {
    borderTopWidth: 1,
    borderBottomWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  previewTitleStyle: {
    flexWrap: 'wrap',
    textAlign: 'left',
    marginBottom: 8,
  },
  previewDescStyle: {
    textAlign: 'left',
    paddingVertical: 8,
  },
  previewTextStyle: {
    paddingHorizontal: 5,
    textAlign: 'left',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    paddingVertical: 8,
  },
  previewLinkStyle: {
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  msgTimestampStyle: {
    fontSize: 11,
    fontWeight: '500',
    textTransform: 'uppercase',
  },
  avatarStyle: {
    flexWrap: 'wrap',
    flexDirection: 'row',
    width: 36,
    height: 36,
    marginRight: 8,
    backgroundColor: 'rgba(51,153,255,0.25)',
    borderRadius: 25,
    alignSelf: 'flex-end',
    marginBottom: 20
  },
  containerStyle: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderRightColor: "transparent",
    borderTopColor: "#cc9933",
    transform: [{ rotate: "180deg" }],
    position: "absolute",
    bottom: 0,
    left: -9
  },
});
