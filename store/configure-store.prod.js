import {applyMiddleware, createStore} from 'redux';
import api from 'app/middleware/api';
import reducer from 'app/reducers';
import schema from 'app/store/schema';
import thunk from 'redux-thunk';

const createStoreWithMiddleware = applyMiddleware(thunk, api)(createStore);

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(reducer, initialState);
  schema.from(store.getState().entities);

  return store;
}
