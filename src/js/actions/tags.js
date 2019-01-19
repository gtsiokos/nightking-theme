import {stringify} from 'query-string';
import api from '../services/api';


export const GET_TAG_LIST = 'GET_TAG_LIST';
export const GET_TAG      = 'GET_TAG';
export const CREATE_TAG   = 'CREATE_TAG';
export const UPDATE_TAG   = 'UPDATE_TAG';
export const DELETE_TAG   = 'DELETE_TAG';

export function get_tag_list(query){
  return {
    type: GET_TAG_LIST,
    payload: api.get(`/tags/?${stringify(query)}`)
  };
};

export function get_tag(id){
  return {
    type: GET_TAG,
    payload: api.get(`/tags/${id}/`)
  };
};

export function create_tag(data){
  return {
    type: CREATE_TAG,
    payload: api.post(`/tags/`, data)
  };
};

export function update_tag(id, data){
  return {
    type: UPDATE_TAG,
    payload: api.put(`/tags/${id}/`, data)
  };
};

export function delete_tag(id){
  return {
    type: DELETE_TAG,
    payload: api.delete(`/tags/${id}/`)
  };
};
