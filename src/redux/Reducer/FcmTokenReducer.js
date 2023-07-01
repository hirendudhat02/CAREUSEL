import {FCMTOKEN_REQUEST, FCMTOKEN_RESPONSE} from '../Services/Type';

const initialState = {
  data: null,
};

export const FcmTokenReducer = (state = initialState, action) => {
  const prevState = {...state};
  const {type} = action;

  switch (type) {
    case FCMTOKEN_REQUEST:
      return {
        ...prevState,
        action: action,
      };
    case FCMTOKEN_RESPONSE:
      return {
        ...prevState,
        data: action.payload,
      };
  }
  return prevState;
};
