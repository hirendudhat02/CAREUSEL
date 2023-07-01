import {INVITEUSER_REQUEST, INVITEUSER_RESPONSE} from '../Services/Type';

const initialState = {
  data: null,
};

export const InviteUserReducer = (state = initialState, action) => {
  const prevState = {...state};
  const {type} = action;

  switch (type) {
    case INVITEUSER_REQUEST:
      return {
        ...prevState,
        action: action,
      };
    case INVITEUSER_RESPONSE:
      return {
        ...prevState,
        data: action.payload,
      };
  }
  return prevState;
};
