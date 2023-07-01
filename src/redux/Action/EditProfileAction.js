import * as TYPES from '../Services/Type';

export function EditProfileResponse(data) {
  return {
    type: TYPES.EDITPROFILE_RESPONSE,
    payload: data,
  };
}

export function EditProfileRequest(bodydata, token, navigation) {
  return {
    type: TYPES.EDITPROFILE_REQUEST,
    bodydata: bodydata,
    token: token,
    navigation: navigation,
  };
}
