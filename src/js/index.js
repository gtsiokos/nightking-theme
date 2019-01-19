import React from 'react';
import ReactDOM from 'react-dom';
import { Provider } from 'react-redux';
import { AppContainer } from 'react-hot-loader'

import Router from './router';
import Store from './store';

import Viewport from './ui/viewport';

Promise
  .resolve()
  .then(() => Store.connect())
  .then(store => {
    const render = Router => {
      ReactDOM.render(
        <AppContainer>
          <Viewport portrait={[1920,1080]} landscape={[1920,1080]}>
            <Provider store={store}>
              <Router />
            </Provider>
          </Viewport>
        </AppContainer>,
        document.querySelector('#root')
      )
    }

    if (module.hot) {
      module.hot.accept('./router', () => { 
        const updatedRouter = require('./router').default;
        render(updatedRouter);
      })
    }

    render(Router);
  });
