import {LOGOUT_REQUEST, LOGOUT_RESPONSE} from '../Services/Type';

const initialState = {
  data: null,
};

export const LogOutReducer = (state = initialState, action) => {
  const prevState = {...state};
  const {type} = action;

  switch (type) {
    case LOGOUT_REQUEST:
      return {
        ...prevState,
        action: action,
      };
    case LOGOUT_RESPONSE:
      return {
        ...prevState,
        data: action.payload,
      };
  }
  return prevState;
};
