import {
  CHANGE_PASSWORD_REQUEST,
  CHNAGE_PASSWORD_RESPONSE,
} from '../Services/Type';

const initialState = {
  data: null,
};

export const ChangePasswordReducer = (state = initialState, action) => {
  const prevState = {...state};
  const {type} = action;

  switch (type) {
    case CHANGE_PASSWORD_REQUEST:
      return {
        ...prevState,
        action: action,
      };
    case CHNAGE_PASSWORD_RESPONSE:
      return {
        ...prevState,
        data: action.payload,
      };
  }
  return prevState;
};
