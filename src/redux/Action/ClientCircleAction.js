import * as TYPES from '../Services/Type';

export function ClientCircleResponse(data) {
  return {
    type: TYPES.CLIENTCIRCLE_RESPONSE,
    payload: data,
  };
}

export function ClientCircleRequest(bodydata, token, navigation) {
  return {
    type: TYPES.CLIENTCIRCLE_REQUEST,
    bodydata: bodydata,
    token: token,
    navigation: navigation,
  };
}
