import {applyMiddleware, createStore} from 'redux';
import createSagaMiddleware from 'redux-saga';
import reducer from '../../redux/Reducer/index';
import mySaga from '../../redux/Saga/index';

// create the saga middleware
const sagaMiddleware = createSagaMiddleware();
// mount it on the Store
const store = createStore(reducer, applyMiddleware(sagaMiddleware));
// then run the saga
sagaMiddleware.run(mySaga);
// render the application

export default store;
