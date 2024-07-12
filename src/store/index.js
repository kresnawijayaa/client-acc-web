import { legacy_createStore as createStore, applyMiddleware, combineReducers } from 'redux';
import { thunk } from 'redux-thunk';
// import authReducer from '../reducers/authReducer';
// import customerReducer from '../reducers/customerReducer';

const rootReducer = combineReducers({
    // auth: authReducer,
    // customers: customerReducer
});

const store = createStore(rootReducer, applyMiddleware(thunk));

export default store;
