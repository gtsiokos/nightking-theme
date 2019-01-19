import {parse} from 'query-string';
import {unionBy} from 'lodash';

import {
  GET_EVENT,
  GET_EVENT_LIST,
  SET_FILTER,
  APPLY_FILTERS,
} from '../actions/events';

const initial_state = {
  items: [],
  filters: {},
  item_selected: {},
  next_page: 1,
  apply_filters: false
};

export default function ( state=initial_state, action) {
  let data = action.payload && action.payload.data 
    ? action.payload.data
    : undefined

  switch(action.type) {
    case GET_EVENT_LIST:
      let page = parseInt(parse(action.payload.config.url)._page, 10);
      let is_first_page = !!(page == 1);
      let next_page = data.length
        ? is_first_page
          ? 3 // page 2 is already fetched when the first API call requested 40 items (page 1,2)
          : page+1
        : null; // when response array is empty notifies the component to stop fetching more pages 

      data = is_first_page ? data : unionBy(state.items, data, 'id');

      return {
        ...state,
        items: data,
        next_page: next_page,
        apply_filters: false
      };

    case GET_EVENT:
      return {
        ...state,
        item_selected: data
      }

    case SET_FILTER:
      let new_filter = {};
      new_filter[action.payload.key] = action.payload.value;

      return {
        ...state,
        filters: {...state.filters, ...new_filter}
      };

    case APPLY_FILTERS:
      return {
        ...state,
        items: [],
        items_next_page: 1,
        apply_filters: true
      };

    default:
      return {
        ...state
      };
  }
};
