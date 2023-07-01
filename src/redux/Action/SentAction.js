import * as TYPES from '../Services/Type';

export function SentResponse(data) {
  return {
    type: TYPES.SENT_RESPONSE,
    payload: data,
  };
}

export function SentRequest(payloade, token, navigation) {
  return {
    type: TYPES.SENT_REQUEST,
    bodydata: payloade,
    token: token,
    navigation: navigation,
  };
}
