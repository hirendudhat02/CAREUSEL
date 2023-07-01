import * as TYPES from '../Services/Type';

export function ActiveStatusResponse(data) {
  return {
    type: TYPES.ACTIONSTATUS_RESPONSE,
    payload: data,
  };
}

export function ActiveStatusRequest(bodydata, token, navigation) {
  return {
    type: TYPES.ACTIONSTATUS_REQUEST,
    bodydata: bodydata,
    token: token,
    navigation: navigation,
  };
}
