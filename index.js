import { render } from 'react-dom';

import 'util/initialize-deps';
import templ from './containers/root/root';
import configureStore from './store/configure-store';

const store = configureStore();

render(templ({store}), document.getElementById('root'));
