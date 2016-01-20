import React from 'react';
import { Provider } from 'react-redux';

import configreStore from 'app/store/configure-store';

export function containerElFac(spec) {
  const {klass, props, initialState: initialState = {}} = spec;
  const store = configreStore(initialState);
  return React.createElement(
    Provider,
    {store},
    React.createElement(klass, props)
  );
}
