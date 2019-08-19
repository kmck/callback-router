import React from 'react';
import { Provider } from 'react-redux';

import store from './store';
import App from './App';

const ReduxExampleApp: React.FC<any> = (props) => (
  <Provider store={store}>
    <App {...props} />
  </Provider>
);

export default ReduxExampleApp;
