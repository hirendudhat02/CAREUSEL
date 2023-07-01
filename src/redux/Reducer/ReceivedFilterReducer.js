import {RECEIVEDFILTER} from '../Services/Type';

const initialState = {
  filter: null,
};

export const RecievedFilterReducer = (state = initialState, action) => {
  const prevState = {...state};
  const {type} = action;
  // console.log('Loader Reducer before switch case type call:::', type);

  switch (type) {
    case RECEIVEDFILTER:
      // console.log('Loader Reducer type call:::', type);
      return {
        ...prevState,
        filter: action.data,
      };
  }
  return prevState;
};
