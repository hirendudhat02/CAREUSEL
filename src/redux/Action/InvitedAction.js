import * as TYPES from '../Services/Type';

export function InvitedResponse(data) {
  return {
    type: TYPES.INVITED_RESPONSE,
    payload: data,
  };
}

export function InvitedRequest(bodydata, token, navigation) {
  return {
    type: TYPES.INVITED_REQUEST,
    bodydata: bodydata,
    token: token,
    navigation: navigation,
  };
}
