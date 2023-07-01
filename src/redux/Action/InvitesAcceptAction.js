import * as TYPES from '../Services/Type';

export function InvitesAcceptResponse(data) {
  return {
    type: TYPES.INVITESACCEPTSTATUS_RESPONSE,
    payload: data,
  };
}

export function InvitesAcceptRequest(bodydata, token, navigation) {
  return {
    type: TYPES.INVITESACCEPTSTATUS_REQUEST,
    bodydata: bodydata,
    token: token,
    navigation: navigation,
  };
}
