import {StyleSheet, View} from 'react-native';
import React, {useState} from 'react';
import {Container, Text} from '../../../components';
import {Step} from '../components';
import BasicInfo from './BasicInfo';
import Verification from './Verification';
import SetPassword from './SetPassword';
import Loader from '../../../helpers/loader';

const tabs = [
  {
    title: 'Basic Info',
    tab: 1,
  },
  {
    title: 'Verification',
    tab: 2,
  },
  {
    title: 'Set Password',
    tab: 3,
  },
];

const tabsComponent = [
  {
    component: BasicInfo,
  },
  {
    component: Verification,
  },
  {
    component: SetPassword,
  },
];

const SignUp = () => {
  const [activeTab, setActiveTab] = useState(tabs[0]);
  const [loader, setLoader] = useState(false);

  const onBasicInfoComplete = user => {
    setActiveTab(tabs[1]);
  };
  const onVerificationCompleted = () => {
    setActiveTab(tabs[2]);
  };

  const onBackPress = () => {
    setActiveTab(tabs[activeTab.tab - 2]);
  };
  const onLoader = value => {
    setLoader(value);
  };

  return (
    <View style={{flex: 1}}>
      <Container
        title={'Sign Up'}
        iconLeft={activeTab === tabs[0] ? null : 'Back'}
        onIconLeftPress={onBackPress}>
        <View style={styles.container}>
          <Step activeTab={activeTab} tabs={tabs} />
          {React.createElement(tabsComponent[activeTab.tab - 1].component, {
            onBasicInfoComplete: onBasicInfoComplete,
            onVerificationCompleted: onVerificationCompleted,
            onLoader: onLoader,
          })}
        </View>
      </Container>
      <Loader value={loader} />
    </View>
  );
};

export default SignUp;

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
});
