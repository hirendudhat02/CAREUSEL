import {CLIENTCIRCLE_REQUEST, CLIENTCIRCLE_RESPONSE} from '../Services/Type';

const initialState = {
  data: null,
};

export const ClientCircleReducer = (state = initialState, action) => {
  const prevState = {...state};
  const {type} = action;

  switch (type) {
    case CLIENTCIRCLE_REQUEST:
      return {
        ...prevState,
        action: action,
      };
    case CLIENTCIRCLE_RESPONSE:
      return {
        ...prevState,
        data: action.payload,
      };
  }
  return prevState;
};
