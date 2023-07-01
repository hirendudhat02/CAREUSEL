import { StyleSheet } from 'react-native';
import { widthRatio } from '../../../utils/consts';

export default StyleSheet.create({
  container: { marginBottom: 16, marginRight: 8 },
  messageWrapperStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#3a4d8f',
    marginBottom: 4,
    alignSelf: 'flex-end',
    justifyContent: 'space-between',
    paddingHorizontal: 12 * widthRatio,
    paddingVertical: 8,
    maxWidth: '65%',
    borderTopLeftRadius: 6,
    borderTopRightRadius: 6,
    borderBottomLeftRadius: 6,
  },
  messageInfoWrapperStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  messageDetailContainer: { flex: 1, marginRight: 4 },
  messageTextStyle: { color: 'white', fontSize: 15, textAlign: 'justify' },
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
});
