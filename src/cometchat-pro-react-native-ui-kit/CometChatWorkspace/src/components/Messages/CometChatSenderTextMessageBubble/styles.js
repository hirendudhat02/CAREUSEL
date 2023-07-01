import { StyleSheet } from 'react-native';
import { fonts } from '../../../../../../theme';
import { heightRatio, widthRatio } from '../../../utils/consts';

export default StyleSheet.create({
  container: { marginBottom: 16, marginRight: 8 },
  linkTitle: { fontWeight: '700' },
  linkDescription: {
    fontStyle: 'italic',
    fontSize: 15,
  },
  autoLinkStyle: { color: 'white', fontSize: 15, fontFamily: fonts.SemiBold },
  previewAutoLinkStyle: { textAlign: 'center' },
  linkStyle: { textDecorationLine: 'underline', fontSize: 15 },
  linkTextStyle: { fontWeight: '700' },
  messageWrapperStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3a4d8f',
    alignSelf: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 12,
    paddingVertical: 8,
    maxWidth: '65%',
    // borderRadius: 6,
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 6,
    marginBottom: 4,
  },
  messageInfoWrapperStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
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
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderRightWidth: 10,
    borderTopWidth: 10,
    borderRightColor: "transparent",
    borderTopColor: "#3a4d8f",
    transform: [{ rotate: "270deg" }],
    position: "absolute",
    bottom: 0,
    right: -9
  },
  editIcon: {
    marginTop: 10
  }
});
