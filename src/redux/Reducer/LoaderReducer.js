import {LOADER} from '../Services/Type';

const initialState = {
  loader: false,
};


export const LoaderReducer = (state = initialState, action) => {
  const prevState = {...state};
  const {type} = action;
  // console.log('Loader Reducer before switch case type call:::', type);

  switch (type) {
    case LOADER:
      // console.log('Loader Reducer type call:::', type);
      return {
        ...prevState,
        loader: action.loader,
      };
  }
  return prevState;
};
