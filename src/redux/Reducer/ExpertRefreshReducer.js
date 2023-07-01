import {EXPERTREFRESH} from '../Services/Type';

const initialState = {
  data: null,
};

export const ExpertRefreshReducer = (state = initialState, action) => {
  const prevState = {...state};
  const {type} = action;
  // console.log('Loader Reducer before switch case type call:::', type);

  switch (type) {
    case EXPERTREFRESH:
      // console.log('Loader Reducer type call:::', type);
      return {
        ...prevState,
        data: action.loader,
      };
  }
  return prevState;
};
