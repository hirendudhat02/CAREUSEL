import {INVITESSTATUS_REQUEST, INVITESSTATUS_RESPONSE} from '../Services/Type';

const initialState = {
  data: null,
};

export const InvitesStatusReducer = (state = initialState, action) => {
  const prevState = {...state};
  const {type} = action;

  switch (type) {
    case INVITESSTATUS_REQUEST:
      return {
        ...prevState,
        action: action,
      };
    case INVITESSTATUS_RESPONSE:
      return {
        ...prevState,
        data: action.payload,
      };
  }
  return prevState;
};
