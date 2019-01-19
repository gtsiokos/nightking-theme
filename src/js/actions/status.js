import {stringify} from 'query-string';
import api from '../services/api';


export const GET_STATUS_LIST = 'GET_STATUS_LIST';
export const GET_STATUS      = 'GET_STATUS';
export const CREATE_STATUS   = 'CREATE_STATUS';
export const UPDATE_STATUS   = 'UPDATE_STATUS';
export const DELETE_STATUS   = 'DELETE_STATUS';

export function get_status_list(query){
  return {
    type: GET_STATUS_LIST,
    payload: api.get(`/status/?${stringify(query)}`)
  };
};

export function get_status(id){
  return {
    type: GET_STATUS,
    payload: api.get(`/status/${id}/`)
  };
};

export function create_status(data){
  return {
    type: CREATE_STATUS,
    payload: api.post(`/status/`, data)
  };
};

export function update_status(id, data){
  return {
    type: UPDATE_STATUS,
    payload: api.put(`/status/${id}/`, data)
  };
};

export function delete_status(id){
  return {
    type: DELETE_STATUS,
    payload: api.delete(`/status/${id}/`)
  };
};
