import {
  INVIINVITESACCEPTSTATUS_REQUEST,
  INVITESACCEPTSTATUS_RESPONSE,
} from '../Services/Type';

const initialState = {
  data: null,
};

export const InvitesAcceptReducer = (state = initialState, action) => {
  const prevState = {...state};
  const {type} = action;

  switch (type) {
    case INVIINVITESACCEPTSTATUS_REQUEST:
      return {
        ...prevState,
        action: action,
      };
    case INVITESACCEPTSTATUS_RESPONSE:
      return {
        ...prevState,
        data: action.payload,
      };
  }
  return prevState;
};
