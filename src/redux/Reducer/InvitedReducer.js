import {INVITED_REQUEST, INVITED_RESPONSE} from '../Services/Type';

const initialState = {
  data: null,
};

export const InvitedReducer = (state = initialState, action) => {
  const prevState = {...state};
  const {type} = action;

  switch (type) {
    case INVITED_REQUEST:
      return {
        ...prevState,
        action: action,
      };
    case INVITED_RESPONSE:
      return {
        ...prevState,
        data: action.payload,
      };
  }
  return prevState;
};
