import uuid from 'uuid';
import {delay} from 'redux-saga';
import { 
  put, 
  takeEvery 
} from 'redux-saga/effects';

import {
  NEW_TASK,
  UPDATE_TASK,
  HIDE_TASK,
  DELETE_TASK
} from '../actions/tasks';

import {
  LEVEL_PENDING,
  LEVEL_SUCCESS,
  LEVEL_ERROR
} from '../tasks/levels';

import {
  TASK_ALERT_RUNTIME_ERROR,
  TASK_ALERT_SESSION_ERROR,
  TASK_ALERT_REQUEST_ERROR,
  TASK_ALERT_SERVERINTERNAL_ERROR
} from '../tasks/types';


export function* create_task(data){
  //console.log('create', data)
  let payload = data.payload.task;
  yield put({type:NEW_TASK, payload})
}

export function* update_task(data){
  let status = data.payload.status 
    ? parseInt((data.payload.status+'')[0])
    : 2;

  if(status != 2){
    let id = uuid();
    let type = (status == 5)
      ? TASK_ALERT_SERVERINTERNAL_ERROR
      : (status == 4)
        ? data.payload.status == 401
          ? TASK_ALERT_SESSION_ERROR
          : TASK_ALERT_REQUEST_ERROR
        : TASK_ALERT_RUNTIME_ERROR;

    yield put({type:NEW_TASK, payload:{...data.payload.task, id, type}});
  }

  //console.log('uodate', data)
  let result = {...data.payload};
  delete result['task'];

  //let payload = {...data.payload.task, ...result};
  let payload = data.payload.task;
  payload.action.payload = result;

  yield put({type:UPDATE_TASK, payload});
  yield delay(4400);
  yield put({type:DELETE_TASK, payload});
}

export function* watch_pending() {
  yield takeEvery(action => action.payload && action.payload.task && action.payload.task.level == LEVEL_PENDING, create_task);
}

export function* watch_success() {
  yield takeEvery(action => action.payload && action.payload.task && action.payload.task.level == LEVEL_SUCCESS, update_task);
}

export function* watch_error() {
  yield takeEvery(action => action.payload && action.payload.task && action.payload.task.level == LEVEL_ERROR, update_task);
}
