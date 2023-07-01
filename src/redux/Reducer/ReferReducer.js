import {REFER_REQUEST, REFER_RESPONSE} from '../Services/Type';

const initialState = {
  data: null,
};

export const ReferReducer = (state = initialState, action) => {
  const prevState = {...state};
  const {type} = action;

  switch (type) {
    case REFER_REQUEST:
      return {
        ...prevState,
        action: action,
      };
    case REFER_RESPONSE:
      return {
        ...prevState,
        data: action.payload,
      };
  }
  return prevState;
};
