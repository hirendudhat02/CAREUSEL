import * as TYPES from '../Services/Type';

export function InvitesStatusResponse(data) {
  return {
    type: TYPES.INVITESSTATUS_RESPONSE,
    payload: data,
  };
}

export function InvitesStatusRequest(bodydata, token, navigation) {
  return {
    type: TYPES.INVITESSTATUS_REQUEST,
    bodydata: bodydata,
    token: token,
    navigation: navigation,
  };
}
