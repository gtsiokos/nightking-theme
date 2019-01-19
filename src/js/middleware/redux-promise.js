/*
 * This is a modified version of the redux-promise library found at
 * https://github.com/acdlite/redux-promise
 *
 * The modifications were found necessary in order to have better
 * error handling using promises functionality which was ommited by
 * the original version
 */
import uuid from 'uuid';
import {isFSA} from 'flux-standard-action';

import {
  LEVEL_PENDING,
  LEVEL_SUCCESS,
  LEVEL_ERROR
} from '../tasks/levels';


function isPromise(val) {
  return val && typeof val.then === 'function';
}

export default store => next => action => {
  /*
  if (!isFSA(action)) {
    return isPromise(action)
      ? action.then(store.dispatch)
      : next(action);
  }
  */

  return isPromise(action.payload)
    ? new Promise((resolve, reject) => {
        /*
         * If action is a Promise then it should be API request
         * in which case we dispatch an API_REQUEST task as PENDING
         * before the actual xhr call will take place.
         */
        let defer = Promise.resolve();
        let type = action.type;

        let task = action.task || {};
        let task_tpl = {
          id: uuid(),
          type: 'TASK_API_REQUEST',
          level: LEVEL_PENDING,
          action: action
        }
        task = {...task_tpl, ...task}

        Promise
          .resolve()
          // Dispatch pending task
          .then(() => store.dispatch({ type: type+'...PENDING', payload: {task} }))
          // Make the actual xhr call
          .then(() => action.payload)
          .then(payload => {
            task = {...task, level:LEVEL_SUCCESS};
            let _action  = { type: type, payload: {...payload, task} };

            defer = defer
              // Dispatch the payload result
              .then(() => store.dispatch(_action))
              // Update pending task
              .then(() => store.dispatch({type: _action.type+'...SUCCESS', payload: _action.payload }))
              .then(() => {
                resolve(_action.payload);
                return Promise.resolve();
              });
          })
          .catch(payload => {
            task = {...task, level:LEVEL_ERROR};
            let _action  = { type: type, payload: {...payload, task} };

            defer = defer
              // Update pending task
              .then(() => store.dispatch({type: _action.type+'...ERROR', payload: _action.payload }))
              .then(() => {
                // Resolve promise
                reject(_action.payload);
                return Promise.resolve();
              });
          });

      })
    : next(action);


};