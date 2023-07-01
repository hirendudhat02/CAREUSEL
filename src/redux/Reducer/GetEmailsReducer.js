import {GETEMAILS_RESPONSE, GETEMAILS_REQUEST} from '../Services/Type';

const initialState = {
  data: null,
};

export const GetEmailsReducer = (state = initialState, action) => {
  const prevState = {...state};
  const {type} = action;

  switch (type) {
    case GETEMAILS_REQUEST:
      return {
        ...prevState,
        action: action,
      };
    case GETEMAILS_RESPONSE:
      return {
        ...prevState,
        data: action.payload,
      };
  }
  return prevState;
};
