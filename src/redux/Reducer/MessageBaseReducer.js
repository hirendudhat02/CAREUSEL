import {MESSAGEBDGE} from '../Services/Type';

const initialState = {
  count: null,
};

export const MessageBaseReducer = (state = initialState, action) => {
  const prevState = {...state};
  const {type} = action;
  // console.log('Loader Reducer before switch case type call:::', type);

  switch (type) {
    case MESSAGEBDGE:
      // console.log('Loader Reducer type call:::', action.data);
      return {
        ...prevState,
        count: action.data,
      };
  }
  return prevState;
};
