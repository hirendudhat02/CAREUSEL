import {MYPROFILE_REQUEST, MYPROFILE_RESPONSE} from '../Services/Type';

const initialState = {
  data: null,
};

export const MyProfileReducer = (state = initialState, action) => {
  const prevState = {...state};
  const {type} = action;

  switch (type) {
    case MYPROFILE_REQUEST:
      return {
        ...prevState,
        action: action,
      };
    case MYPROFILE_RESPONSE:
      return {
        ...prevState,
        data: action.payload,
      };
  }
  return prevState;
};
