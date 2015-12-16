import { render } from 'react-dom';
import configureStore from './store/configure-store';
import templ from './containers/app/app.jsx';

const INITIAL_STATE = {entities: {}};

const store = configureStore(INITIAL_STATE);

render(templ({store}), document.getElementById('root'));
