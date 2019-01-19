import {stringify} from 'query-string';
import api from '../services/api';


export const GET_FEED_LIST = 'GET_FEED_LIST';
export const GET_FEED      = 'GET_FEED';
export const CREATE_FEED   = 'CREATE_FEED';
export const UPDATE_FEED   = 'UPDATE_FEED';
export const DELETE_FEED   = 'DELETE_FEED';

export function get_feed_list(query){
  return {
    type: GET_FEED_LIST,
    payload: api.get(`/feeds/?${stringify(query)}`)
  };
};

export function get_feed(id){
  return {
    type: GET_FEED,
    payload: api.get(`/feeds/${id}/`)
  };
};

export function create_feed(data){
  return {
    type: CREATE_FEED,
    payload: api.post(`/feeds/`, data)
  };
};

export function update_feed(id, data){
  return {
    type: UPDATE_FEED,
    payload: api.put(`/feeds/${id}/`, data)
  };
};

export function delete_feed(id){
  return {
    type: DELETE_FEED,
    payload: api.delete(`/feeds/${id}/`)
  };
};
