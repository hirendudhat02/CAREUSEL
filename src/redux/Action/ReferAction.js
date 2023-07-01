import * as TYPES from '../Services/Type';

export function ReferResponse(data) {
  return {
    type: TYPES.REFER_RESPONSE,
    payload: data,
  };
}

export function ReferRequest(payloade, token, navigation) {
  return {
    type: TYPES.REFER_REQUEST,
    bodydata: payloade,
    token: token,
    navigation: navigation,
  };
}
