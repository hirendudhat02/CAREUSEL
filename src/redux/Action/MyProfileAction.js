import * as TYPES from '../Services/Type';

export function MyProfileResponse(data) {
  return {
    type: TYPES.MYPROFILE_RESPONSE,
    payload: data,
  };
}

export function MyProfileRequest(payloade, navigation) {
  return {
    type: TYPES.MYPROFILE_REQUEST,
    bodydata: payloade,
    navigation: navigation,
  };
}
