import {SENT_REQUEST, SENT_RESPONSE} from '../Services/Type';

const initialState = {
  data: null,
};

export const SentReducer = (state = initialState, action) => {
  const prevState = {...state};
  const {type} = action;

  switch (type) {
    case SENT_REQUEST:
      return {
        ...prevState,
        action: action,
      };
    case SENT_RESPONSE:
      return {
        ...prevState,
        data: action.payload,
      };
  }
  return prevState;
};
