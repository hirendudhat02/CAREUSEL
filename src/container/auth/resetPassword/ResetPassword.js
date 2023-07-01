import React, {useState} from 'react';
import EmailPassword from './EmailPassword';
import SetPassword from './SetPassword';

const COMP = {
  Email: EmailPassword,
  NewPassword: SetPassword,
};

const ResetPassword = () => {
  const [activeScreen, setActiveScreen] = useState('Email');

  const onCheckMailPress = () => {
    setActiveScreen('NewPassword');
  };

  const onSetPasswordPress = () => {};

  return React.createElement(COMP[activeScreen], {
    onCheckMailPress: onCheckMailPress,
    onSetPasswordPress: onSetPasswordPress,
  });
};

export default ResetPassword;
