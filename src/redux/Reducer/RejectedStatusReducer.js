import {
  REJECTEDSTATUS_REQUEST,
  REJECTEDSTATUS_RESPONSE,
} from '../Services/Type';

const initialState = {
  data: null,
};

export const RejectedStatusReducer = (state = initialState, action) => {
  const prevState = {...state};
  const {type} = action;

  switch (type) {
    case REJECTEDSTATUS_REQUEST:
      return {
        ...prevState,
        action: action,
      };
    case REJECTEDSTATUS_RESPONSE:
      return {
        ...prevState,
        data: action.payload,
      };
  }
  return prevState;
};
