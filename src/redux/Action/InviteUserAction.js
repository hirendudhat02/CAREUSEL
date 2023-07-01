import * as TYPES from '../Services/Type';

export function InviteUserResponse(data) {
  return {
    type: TYPES.INVITEUSER_RESPONSE,
    payload: data,
  };
}

export function InviteUserRequest(bodydata, token, navigation) {
  return {
    type: TYPES.INVITEUSER_REQUEST,
    bodydata: bodydata,
    token: token,
    navigation: navigation,
  };
}
