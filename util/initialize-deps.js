import infect from 'infect';

import configureStore from 'app/store/configure-store';

const store = configureStore();
infect.set('Store', store);
