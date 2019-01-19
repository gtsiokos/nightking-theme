import { createStore, applyMiddleware } from 'redux';

import ReduxPromise from './middleware/redux-promise';
import createSagaMiddleware from 'redux-saga';
import reducers from './reducers/';
import sagas from './sagas/';

class Store {
  constructor(){
    this._store = {};

    return this;
  }

  get state() {
    return this._store.getState();
  }

  dispatch(...args){
    return this._store.dispatch.apply(null, args);
  }

  subscribe(...args){
    return this._store.subscribe.apply(null, args);
  }

  connect() {
    const SagaMiddleware = createSagaMiddleware();

    return Promise
      .resolve()
      //.then(() => this.session)
      .then(store => {
        this._store = createStore(
          reducers,
          store || {},
          applyMiddleware(ReduxPromise, SagaMiddleware)
        );

        SagaMiddleware.run(sagas);

        return Promise.resolve(this._store);
      });
  }
}

export default new Store();