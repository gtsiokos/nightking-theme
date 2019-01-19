
export const NEW_TASK             = 'NEW_TASK';
export const UPDATE_TASK          = 'UPDATE_TASK';
export const HIDE_TASK            = 'HIDE_TASK';
export const DELETE_TASK          = 'DELETE_TASK';
export const CLEAR_TASK_BY_TYPE   = 'CLEAR_TASK_BY_TYPE';

export function new_task(data){
  return {
    type: NEW_TASK,
    payload: data
  };
}

export function update_task(data){
  return {
    type: UPDATE_TASK,
    payload: data
  };
}

export function clear_task_by_type(type=null){
  return {
    type: CLEAR_TASK_BY_TYPE,
    payload: { type }
  };
}
