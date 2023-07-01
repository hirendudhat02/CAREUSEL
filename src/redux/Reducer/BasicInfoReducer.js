import {BASICINFO_REQUEST, BASICINFO_RESPONSE} from '../Services/Type';

const initialState = {
  data: null,
};

export const BasicInfoReducer = (state = initialState, action) => {
  const prevState = {...state};
  const {type} = action;

  switch (type) {
    case BASICINFO_REQUEST:
      return {
        ...prevState,
        action: action,
      };
    case BASICINFO_RESPONSE:
      return {
        ...prevState,
        data: action.payload,
      };
  }
  return prevState;
};
