import { render } from 'react-dom';
import infect from 'infect';

import './util/initialize-deps';
import templ from './containers/root/root';
import configureStore from './store/configure-store';

const store = configureStore();
infect.set('Store', store);

render(templ({store}), document.getElementById('root'));
