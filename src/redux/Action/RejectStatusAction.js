import * as TYPES from '../Services/Type';

export function RejectedStatusResponse(data) {
  return {
    type: TYPES.REJECTEDSTATUS_RESPONSE,
    payload: data,
  };
}

export function RejectedStatusRequest(bodydata, token) {
  return {
    type: TYPES.REJECTEDSTATUS_REQUEST,
    bodydata: bodydata,
    token: token,
  };
}
