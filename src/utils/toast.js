import {showMessage} from 'react-native-flash-message';
const toastConfig = {
  danger: 'danger',
  default: 'default',
  info: 'info',
  none: 'none',
  success: 'success',
  warning: 'warning',
};

const show = (msg, type) => {
  showMessage({
    message: msg,
    type: type !== undefined ? type : toastConfig.info,
  });
};

const Toast = {show};

export default Toast;
