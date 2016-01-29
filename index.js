import { render } from 'react-dom';

import 'util/initialize-deps';
import { assignShortcutKeys } from './actions/models';
import templ from './containers/root/root';
import configureStore from './store/configure-store';

const store = configureStore();
store.dispatch(assignShortcutKeys());

render(templ({store}), document.getElementById('root'));
