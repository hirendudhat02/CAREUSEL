import {CLIENTREFRESH} from '../Services/Type';

const initialState = {
  loader: null,
};

export const ClientRefreshReducer = (state = initialState, action) => {
  const prevState = {...state};
  const {type} = action;
  // console.log('Loader Reducer before switch case type call:::', type);

  switch (type) {
    case CLIENTREFRESH:
      // console.log('Loader Reducer type call:::', type);
      return {
        ...prevState,
        loader: action.loader,
      };
  }
  return prevState;
};
