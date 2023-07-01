import * as TYPES from '../Services/Type';

export function ConversationResponse(data) {
  return {
    type: TYPES.CONVERSATION_RESPONSE,
    payload: data,
  };
}

export function ConversationRequest(payloade, token, navigation) {
  return {
    type: TYPES.CONVERSATION_REQUEST,
    bodydata: payloade,
    token: token,
    navigation: navigation,
  };
}
