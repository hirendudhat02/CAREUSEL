import {FORGOTOTP_REQUEST, FORGOTOTP_RESPONSE} from '../Services/Type';

const initialState = {
  data: null,
};

export const ForgotOtpReducer = (state = initialState, action) => {
  const prevState = {...state};
  const {type} = action;

  switch (type) {
    case FORGOTOTP_REQUEST:
      return {
        ...prevState,
        action: action,
      };
    case FORGOTOTP_RESPONSE:
      return {
        ...prevState,
        data: action.payload,
      };
  }
  return prevState;
};
