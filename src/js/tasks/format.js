import React from 'react';

import {
  GET_EVENT_LIST,
} from '../actions/events';

const PENDING_MESSAGES = {
  DELETE_EVENT: ({data}) => <p>Delete event #{data.id}</p>,
};

const ERROR_MESSAGES = {
  DELETE_EVENT: ({data, payload}) => <p>#{data.id} {payload.data.errors.non_field_errors[0]}</p>,
};

const SUCCESS_MESSAGES = {
  DELETE_EVENT: ({data}) => <p>Event #{data.id} has been deleted</p>
};

export const get_text = (task) => {
  let messages = task.level == 'PENDING'
    ? PENDING_MESSAGES
    : task.level == 'SUCCESS'
      ? SUCCESS_MESSAGES
      : task.level == 'ERROR'
        ? ERROR_MESSAGES
        : undefined;

  let message = messages[task.action.type]
    ? messages[task.action.type]
    : () => null;

  return message({data:task.data, payload:task.action.payload});
}