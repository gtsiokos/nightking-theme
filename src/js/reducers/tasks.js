import {
  NEW_TASK,
  UPDATE_TASK,
  HIDE_TASK,
  DELETE_TASK,
  CLEAR_TASK_BY_TYPE
} from '../actions/tasks';

const sample = [
  {id:1, type:'TASK_EVENT', level:'PROGRESS', status_text: 'Foo me'},
  {id:2, type:'TASK_EVENT', level:'PROGRESS', status_text: 'Foo me'},
  {id:4, type:'TASK_EVENT', level:'SUCCESS', status_text: 'Foo me'},
  {id:5, type:'TASK_EVENT', level:'SUCCESS', status_text: 'Foo me'},
  {id:6, type:'TASK_EVENT', level:'ERROR', status_text: 'Foo me'},
  {id:7, type:'TASK_EVENT', level:'ERROR', status_text: 'Foo me'},
  {id:8, type:'TASK_EVENT', level:'WARNING', status_text: 'Foo me'},
  {id:9, type:'TASK_EVENT', level:'ERROR', status_text: 'Foo me'},
  {id:10, type:'TASK_EVENT', level:'INFO', status_text: 'Foo me'},
  {id:11, type:'TASK_EVENT', level:'ERROR', status_text: 'Foo me'},
  {id:12, type:'TASK_EVENT', level:'ERROR', status_text: 'Foo me'},
  {id:13, type:'TASK_EVENT', level:'INFO', status_text: 'Foo me'}
];

export default function ({items = []} = {}, action) {

  switch(action.type) {
    case NEW_TASK:
      //items.unshift(action.payload)
      //items.slice(0,30);
      items = items.filter(item => item.id != action.payload.id);
      items.unshift(action.payload);

      return {
        items: [...items]
      };

    case UPDATE_TASK:
      items = items.map(item => {
        if(item.id === action.payload.id){
          Object.keys(action.payload).forEach(k => {
            item[k] = !!(action.payload[k]) ? action.payload[k] : item[k];
          });
        }

        return item;
      });

      return {
        items: [...items]
      };

    case DELETE_TASK:
      items = items.filter(item => item.id != action.payload.id);

      return {
        items: [...items]
      };

    case CLEAR_TASK_BY_TYPE:
      items = items.filter(item => {
        return item.type != action.payload.type;
      });

      return {
        items: [...items]
      };

    default:
      return {
        items: items
      };
  }
};
