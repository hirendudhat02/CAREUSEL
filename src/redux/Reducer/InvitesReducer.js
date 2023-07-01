import {INVITES_REQUEST, INVITES_RESPONSE} from '../Services/Type';

const initialState = {
  data: null,
};

export const InvitesReducer = (state = initialState, action) => {
  const prevState = {...state};
  const {type} = action;

  switch (type) {
    case INVITES_REQUEST:
      return {
        ...prevState,
        action: action,
      };
    case INVITES_RESPONSE:
      return {
        ...prevState,
        data: action.payload,
      };
  }
  return prevState;
};
