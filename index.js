import './util/initialize-deps';
import configureStore from './store/configure-store';
import infect from 'infect';
import {render} from 'react-dom';
import templ from './containers/root/root';

const store = configureStore();
infect.set('Store', store);

render(templ({store}), document.getElementById('root'));
