import {EDITPROFILE_REQUEST, EDITPROFILE_RESPONSE} from '../Services/Type';

const initialState = {
  data: null,
};

export const EditProfileReducer = (state = initialState, action) => {
  const prevState = {...state};
  const {type} = action;

  switch (type) {
    case EDITPROFILE_REQUEST:
      return {
        ...prevState,
        action: action,
      };
    case EDITPROFILE_RESPONSE:
      return {
        ...prevState,
        data: action.payload,
      };
  }
  return prevState;
};
