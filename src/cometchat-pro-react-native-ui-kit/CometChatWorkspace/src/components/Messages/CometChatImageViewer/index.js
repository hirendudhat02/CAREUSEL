import React from 'react';
import {
  View,
  Modal,
  Image,
  TouchableOpacity,
  Dimensions,
  TouchableWithoutFeedback,
  FlatList,
} from 'react-native';
import style from './styles';
import { get as _get } from 'lodash';
import BottomSheet from 'reanimated-bottom-sheet';
import AntIcon from 'react-native-vector-icons/Ionicons';
import FastImage from 'react-native-fast-image';

class CometChatImageViewer extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <Modal
        transparent
        // animated
        // animationType="fade"
        visible={this.props.open}
        onRequestClose={() => {
          this.props.close();
        }}>
        <View
          style={style.outerContainer}>
          <View style={style.bottomSheetContainer}>
            <TouchableOpacity
              style={style.crossImgContainer}
              onPress={this.props.close}>
              <AntIcon name="close" size={35} color="#000" />
            </TouchableOpacity>
            <FlatList nestedScrollEnabled
              pagingEnabled
              horizontal
              scrollEnabled
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingBottom: 50, flexGrow: 1, marginTop: 50 }}
              data={this.props.sharedMedia === true ? [this.props.message] : this.props.message?.data?.attachments}
              renderItem={({ item }) => {
                return (
                  <View style={style.outerImageContainer}>
                    <View style={[style.mainContainer]}>
                      <FastImage
                        source={{
                          uri: item.url,
                        }}
                        resizeMode="contain"
                        style={style.imageStyles}
                      />
                    </View>
                  </View>
                )
              }} />
          </View>
        </View>
      </Modal>
    );
  }
}
export default CometChatImageViewer;
