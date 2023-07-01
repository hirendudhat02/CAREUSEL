import * as TYPES from '../Services/Type';

export function ActiveResponse(data) {
  return {
    type: TYPES.ACTIVE_RESPONSE,
    payload: data,
  };
}

export function ActiveRequest(payloade, token, navigation) {
  return {
    type: TYPES.ACTIVE_REQUEST,
    bodydata: payloade,
    token: token,
    navigation: navigation,
  };
}
