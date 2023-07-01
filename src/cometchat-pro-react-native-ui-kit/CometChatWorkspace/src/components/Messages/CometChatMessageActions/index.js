import React from 'react';
import {Modal, TouchableWithoutFeedback, View} from 'react-native';
import style from './styles';
import Actions from './actions';
// import BottomSheet from 'reanimated-bottom-sheet';
import RBSheet from 'react-native-raw-bottom-sheet';
import {colors} from '../../../../../../theme';

export default class CometChatMessageActions extends React.Component {
  sheetRef = React.createRef(null);

  componentDidUpdate(prevProps) {
    if (!prevProps.open && this.props.open) {
      this.sheetRef.current.open();
    }
  }

  renderContent = () => (
    <Actions {...this.props} message={this.props.message} />
  );

  renderHeader = () => <View style={style.header} />;

  render() {
    const {open, close} = this.props;
    return (
      <Modal transparent visible={open}>
        <View style={style.bottomSheetContainer}>
          <TouchableWithoutFeedback
            onPress={() => {
              this.sheetRef.current.close();
              this.props.close();
            }}>
            <View style={style.fullFlex}>
              <RBSheet
                ref={this.sheetRef}
                closeOnDragDown={true}
                height={180}
                onClose={() => {
                  this.props.close();
                }}
                closeOnPressBack={() => {
                  this.props.close();
                }}
                customStyles={{
                  container: {
                    borderColor: colors.shadow,
                    borderWidth: 1,
                    borderTopLeftRadius: 30,
                    borderTopRightRadius: 30,
                  },

                  draggableIcon: {
                    width: 100,
                    // marginTop: 15,
                  },
                }}>
                <Actions {...this.props} message={this.props.message} />
              </RBSheet>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </Modal>
    );
  }
}
