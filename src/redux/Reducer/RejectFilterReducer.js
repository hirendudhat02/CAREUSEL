import {REJECTFILTER} from '../Services/Type';

const initialState = {
  filter: null,
};

export const RejectFilterReducer = (state = initialState, action) => {
  const prevState = {...state};
  const {type} = action;
  // console.log('Loader Reducer before switch case type call:::', type);

  switch (type) {
    case REJECTFILTER:
      // console.log('Loader Reducer type call:::', type);
      return {
        ...prevState,
        filter: action.data,
      };
  }
  return prevState;
};
