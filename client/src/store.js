// redux
import { createStore, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import rootReducer from './reducers';

const middleware = [thunk];
const initialState = {};
const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  ));
  // compose 函数做的事就是把 var a = fn1(fn2(fn3(fn4(x)))) 这种嵌套的调用方式改成 var a = compose(fn1,fn2,fn3,fn4)(x) 

export default store;