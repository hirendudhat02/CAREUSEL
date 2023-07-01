import * as TYPES from '../Services/Type';

export function InvitesResponse(data) {
  return {
    type: TYPES.INVITES_RESPONSE,
    payload: data,
  };
}

export function InvitesRequest(bodydata, token, navigation) {
  return {
    type: TYPES.INVITES_REQUEST,
    bodydata: bodydata,
    token: token,
    navigation: navigation,
  };
}
