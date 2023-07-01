import {VERIFICATION_REQUEST, VERIFICATION_RESPONSE} from '../Services/Type';

const initialState = {
  data: null,
};

export const VerificationReducer = (state = initialState, action) => {
  const prevState = {...state};
  const {type} = action;

  switch (type) {
    case VERIFICATION_REQUEST:
      return {
        ...prevState,
        action: action,
      };
    case VERIFICATION_RESPONSE:
      return {
        ...prevState,
        data: action.payload,
      };
  }
  return prevState;
};
