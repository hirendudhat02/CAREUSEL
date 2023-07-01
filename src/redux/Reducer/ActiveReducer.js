import {ACTIVE_REQUEST, ACTIVE_RESPONSE} from '../Services/Type';

const initialState = {
  data: null,
};

export const ActiveReducer = (state = initialState, action) => {
  const prevState = {...state};
  const {type} = action;

  switch (type) {
    case ACTIVE_REQUEST:
      return {
        ...prevState,
        action: action,
      };
    case ACTIVE_RESPONSE:
      return {
        ...prevState,
        data: action.payload,
      };
  }
  return prevState;
};
