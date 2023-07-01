import * as TYPES from '../Services/Type';

export function ExpertCircleResponse(data) {
  return {
    type: TYPES.EXPERTCIRCLE_RESPONSE,
    payload: data,
  };
}

export function ExpertCircleRequest(bodydata, token, navigation) {
  return {
    type: TYPES.EXPERTCIRCLE_REQUEST,
    bodydata: bodydata,
    token: token,
    navigation: navigation,
  };
}
