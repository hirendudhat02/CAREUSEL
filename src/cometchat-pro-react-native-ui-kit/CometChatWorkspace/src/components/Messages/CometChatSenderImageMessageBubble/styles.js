import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: { marginBottom: 16, marginRight: 8 },
  messageWrapperStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-end',
    justifyContent: 'space-between',
    maxWidth: '65%',
    borderRadius: 10,
    marginBottom: 4,
  },
  messageImgWrapperStyle: {
    alignSelf: 'flex-end',
    width: '100%',
    height: 200,
    flexShrink: 0,
    // flexWrap: "wrap",
    // flexDirection: "row",
    // backgroundColor: "blue"
  },
  messageImg: {
    borderRadius: 8,
    width: 115,
    // height: 85,
    // backgroundColor: "red",
    marginHorizontal: 7
    // width: "50%",
    // height: '100%',
  },
  messageInfoWrapperStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    width: '100%',
  },
});
