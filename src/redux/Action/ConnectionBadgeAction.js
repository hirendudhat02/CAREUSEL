import * as TYPES from '../Services/Type';

export function ConnectionBadgeResponse(data) {
  return {
    type: TYPES.CONNECTIONBADGE_RESPONSE,
    payload: data,
  };
}

export function ConnectionBadgeRequest(bodydata, token, navigation) {
  return {
    type: TYPES.CONNECTIONBADGE_REQUEST,
    bodydata: bodydata,
    token: token,
    navigation: navigation,
  };
}
