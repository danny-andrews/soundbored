import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';

import schema from 'app/store/schema';
import api from 'app/middleware/api';
import reducer from 'app/reducers';

const createStoreWithMiddleware = applyMiddleware(thunk, api)(createStore);

export default function configureStore(initialState) {
  const store = createStoreWithMiddleware(reducer, initialState);
  schema.from(store.getState().entities);
  return store;
}
