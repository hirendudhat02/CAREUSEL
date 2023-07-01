import {PROFILE_REQUEST, PROFILE_RESPONSE} from '../Services/Type';

const initialState = {
  data: null,
};

export const ProfileReducer = (state = initialState, action) => {
  const prevState = {...state};
  const {type} = action;

  switch (type) {
    case PROFILE_REQUEST:
      return {
        ...prevState,
        action: action,
      };
    case PROFILE_RESPONSE:
      return {
        ...prevState,
        data: action.payload,
      };
  }
  return prevState;
};
