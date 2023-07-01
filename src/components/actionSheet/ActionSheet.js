import {StyleSheet, Text, View} from 'react-native';
import React, {useEffect, useRef} from 'react';
import RNActionSheet from 'react-native-actions-sheet';

const ActionSheet = ({isVisible, children, onClose}) => {
  const actionSheetRef = useRef(null);

  useEffect(() => {
    if (isVisible) {
      actionSheetRef.current?.show();
    } else {
      actionSheetRef.current?.hide();
    }
  }, [isVisible]);

  return (
    <RNActionSheet onClose={onClose} ref={actionSheetRef}>
      <View>{children}</View>
    </RNActionSheet>
  );
};

export default ActionSheet;

const styles = StyleSheet.create({});
