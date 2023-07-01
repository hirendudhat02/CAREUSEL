import {
  CONNECTIONBADGE_REQUEST,
  CONNECTIONBADGE_RESPONSE,
} from '../Services/Type';

const initialState = {
  data: null,
};

export const ConnectionBadgeReducer = (state = initialState, action) => {
  const prevState = {...state};
  const {type} = action;

  switch (type) {
    case CONNECTIONBADGE_REQUEST:
      return {
        ...prevState,
        action: action,
      };
    case CONNECTIONBADGE_RESPONSE:
      return {
        ...prevState,
        data: action.payload,
      };
  }
  return prevState;
};
