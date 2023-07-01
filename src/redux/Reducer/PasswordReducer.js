import {PASSWORD_REQUEST, PASSWORD_RESPONSE} from '../Services/Type';

const initialState = {
  data: null,
};

export const PasswordReducer = (state = initialState, action) => {
  const prevState = {...state};
  const {type} = action;

  switch (type) {
    case PASSWORD_REQUEST:
      return {
        ...prevState,
        action: action,
      };
    case PASSWORD_RESPONSE:
      return {
        ...prevState,
        data: action.payload,
      };
  }
  return prevState;
};
