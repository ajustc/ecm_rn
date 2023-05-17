import {createStore, combineReducers, applyMiddleware} from 'redux';
import thunk from 'redux-thunk';

import authReducer from './reducers/auth';
import cartReducer from './reducers/cart';

const middleware = [thunk];

const reducers = combineReducers({
  user: authReducer,
  cart: cartReducer,
});

const store = createStore(reducers, applyMiddleware(...middleware));

export default store;
