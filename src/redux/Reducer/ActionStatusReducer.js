import {ACTIONSTATUS_REQUEST, ACTIONSTATUS_RESPONSE} from '../Services/Type';

const initialState = {
  data: null,
};

export const ActiveStatusReducer = (state = initialState, action) => {
  const prevState = {...state};
  const {type} = action;

  switch (type) {
    case ACTIONSTATUS_REQUEST:
      return {
        ...prevState,
        action: action,
      };
    case ACTIONSTATUS_RESPONSE:
      return {
        ...prevState,
        data: action.payload,
      };
  }
  return prevState;
};
