import * as TYPES from '../Services/Type';

export function InvitedStatusResponse(data) {
  return {
    type: TYPES.INVITEDSTATUS_RESPONSE,
    payload: data,
  };
}

export function InvitedStatusRequest(bodydata, token, navigation) {
  return {
    type: TYPES.INVITEDSTATUS_REQUEST,
    bodydata: bodydata,
    token: token,
    navigation: navigation,
  };
}
