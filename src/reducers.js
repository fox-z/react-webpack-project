import { createStore, applyMiddleware, combineReducers } from 'redux';
import thunkMiddleware from 'redux-thunk';

// import { counter, userInfo } from '$views/home/reducer.js';

const store = createStore(
  combineReducers({
    // counter,
    // userInfo
  }),
  applyMiddleware(thunkMiddleware)
);

export default store;
