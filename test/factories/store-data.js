import i from 'icepick';
import { createStore } from 'redux';
import { Factory } from 'rosie';

import reducer from 'app/reducers';

const initialState = createStore(reducer).getState();

function StoreData(storeData) {
  return i.merge(initialState, storeData);
}

export const StoreDataFac = new Factory(StoreData);
