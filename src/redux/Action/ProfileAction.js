import * as TYPES from '../Services/Type';

export function ProfileResponse(data) {
  return {
    type: TYPES.PROFILE_RESPONSE,
    payload: data,
  };
}

export function ProfileRequest(payloade, navigation) {
  return {
    type: TYPES.PROFILE_REQUEST,
    bodydata: payloade,
    navigation: navigation,
  };
}
