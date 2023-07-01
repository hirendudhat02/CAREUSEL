import {EXPERTCIRCLE_REQUEST, EXPERTCIRCLE_RESPONSE} from '../Services/Type';

const initialState = {
  data: null,
};

export const ExpertCircleReducer = (state = initialState, action) => {
  const prevState = {...state};
  const {type} = action;

  switch (type) {
    case EXPERTCIRCLE_REQUEST:
      return {
        ...prevState,
        action: action,
      };
    case EXPERTCIRCLE_RESPONSE:
      return {
        ...prevState,
        data: action.payload,
      };
  }
  return prevState;
};
