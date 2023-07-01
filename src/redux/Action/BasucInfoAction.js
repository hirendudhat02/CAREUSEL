import * as TYPES from '../Services/Type';

export function BasicInfoResponse(data) {
  return {
    type: TYPES.BASICINFO_RESPONSE,
    payload: data,
  };
}

export function BasicInfoRequest(bodydata, key) {
  return {
    type: TYPES.BASICINFO_REQUEST,
    bodydata: bodydata,
    key: key,
  };
}
