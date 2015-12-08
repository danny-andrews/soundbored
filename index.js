import { render } from 'react-dom';
import configureStore from './store/configure-store';
import templ from './containers/app/app.jsx';

const store = configureStore();

render(templ({store: store}), document.getElementById('root'));
