import {PROFILEUPDATE_REQUEST, PROFILEUPDATE_RESPONSE} from '../Services/Type';

const initialState = {
  data: null,
};

export const ProfileUpdateReducer = (state = initialState, action) => {
  const prevState = {...state};
  const {type} = action;

  switch (type) {
    case PROFILEUPDATE_REQUEST:
      return {
        ...prevState,
        action: action,
      };
    case PROFILEUPDATE_RESPONSE:
      return {
        ...prevState,
        data: action.payload,
      };
  }
  return prevState;
};
