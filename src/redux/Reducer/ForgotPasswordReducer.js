import {
  FORGOTPASSWORD_RESPONSE,
  FORGOTPASSWORD_REQUEST,
} from '../Services/Type';

const initialState = {
  data: null,
};

export const ForgotPasswordReducer = (state = initialState, action) => {
  const prevState = {...state};
  const {type} = action;

  switch (type) {
    case FORGOTPASSWORD_REQUEST:
      return {
        ...prevState,
        action: action,
      };
    case FORGOTPASSWORD_RESPONSE:
      return {
        ...prevState,
        data: action.payload,
      };
  }
  return prevState;
};
