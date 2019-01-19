
export const OPEN_SUBMENU = 'OPEN_SUBMENU';
export const PREVIEW_SUBMENU = 'PREVIEW_SUBMENU';

export function open_submenu(value){
  return {
    type: OPEN_SUBMENU,
    payload: value
  };
}

export function preview_submenu(value){
  return {
    type: PREVIEW_SUBMENU,
    payload: value
  };
}
