import {
  EMAILVERIFICATION_REQUEST,
  EMAILVERIFICATION_RESPONSE,
} from '../Services/Type';

const initialState = {
  data: null,
};

export const EmailVerificationReducer = (state = initialState, action) => {
  const prevState = {...state};
  const {type} = action;

  switch (type) {
    case EMAILVERIFICATION_REQUEST:
      return {
        ...prevState,
        action: action,
      };
    case EMAILVERIFICATION_RESPONSE:
      return {
        ...prevState,
        data: action.payload,
      };
  }
  return prevState;
};
