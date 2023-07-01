import * as TYPES from '../Services/Type';

export function ProfileUpdateResponse(data) {
  return {
    type: TYPES.PROFILEUPDATE_RESPONSE,
    payload: data,
  };
}

export function ProfileUpdateRequest(bodydata, userId, token, navigation) {
  return {
    type: TYPES.PROFILEUPDATE_REQUEST,
    bodydata: bodydata,
    userId: userId,
    token: token,
    navigation: navigation,
  };
}
