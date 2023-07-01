import * as TYPES from '../Services/Type';

export function GetEmailsResponse(data) {
  return {
    type: TYPES.GETEMAILS_RESPONSE,
    payload: data,
  };
}

export function GetEmailsdRequest(bodydata, navigation) {
  return {
    type: TYPES.GETEMAILS_REQUEST,
    bodydata: bodydata,
    navigation: navigation,
  };
}
