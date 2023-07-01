import {REJECTED_REQUEST, REJECTED_RESPONSE} from '../Services/Type';

const initialState = {
  data: null,
};

export const RejectedReducer = (state = initialState, action) => {
  const prevState = {...state};
  const {type} = action;

  switch (type) {
    case REJECTED_REQUEST:
      return {
        ...prevState,
        action: action,
      };
    case REJECTED_RESPONSE:
      return {
        ...prevState,
        data: action.payload,
      };
  }
  return prevState;
};
