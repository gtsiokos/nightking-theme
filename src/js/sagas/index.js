import { fork, all } from 'redux-saga/effects';

import {
  watch_pending,
  watch_success,
  watch_error
} from './tasks';

export default function* sagas() {
  yield all([
    fork(watch_pending),
    fork(watch_success),
    fork(watch_error)
  ]);
}