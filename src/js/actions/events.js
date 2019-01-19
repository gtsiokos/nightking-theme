import {stringify} from 'query-string';
import uuidv3 from 'uuid/v3';
import api from '../services/api';

export const SET_FILTER           = 'SET_FILTER';
export const DELETE_FILTER        = 'DELETE_FILTER';
export const APPLY_FILTERS        = 'APPLY_FILTERS';

export const GET_EVENT_LIST       = 'GET_EVENT_LIST';
export const GET_EVENT            = 'GET_EVENT';
export const DELETE_EVENT         = 'DELETE_EVENT';
export const SEND_EVENTCARD       = 'SEND_EVENTCARD';

export function set_filter(key, value){
  return {
    type: SET_FILTER,
    payload: Promise.resolve({key, value})
  };
}

export function delete_filter(key){
  return {
    type: DELETE_FILTER,
    payload: Promise.resolve(key)
  };
}

export function apply_filters(){
  return {
    type: APPLY_FILTERS,
    payload: Promise.resolve()
  };
}

export function get_event_list(query) {
  return {
    type: GET_EVENT_LIST,
    payload: api.get(`/events/?${stringify(query)}`)
  };
}

export function get_event(id) {
  return {
    type: GET_EVENT,
    payload: api.get(`/events/${id}/`)
  };
}
