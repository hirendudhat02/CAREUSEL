import {INVITEDSTATUS_REQUEST, INVITEDSTATUS_RESPONSE} from '../Services/Type';

const initialState = {
  data: null,
};

export const InvitedStatusReducer = (state = initialState, action) => {
  const prevState = {...state};
  const {type} = action;

  switch (type) {
    case INVITEDSTATUS_REQUEST:
      return {
        ...prevState,
        action: action,
      };
    case INVITEDSTATUS_RESPONSE:
      return {
        ...prevState,
        data: action.payload,
      };
  }
  return prevState;
};
