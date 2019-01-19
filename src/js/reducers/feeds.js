import {
  GET_FEED_LIST,
} from '../actions/feeds';

const initial_state = {
  items: []
};

export default function (state = initial_state, action) {

  switch(action.type) {
    case GET_FEED_LIST:
      return {
        ...state,
        items: action.payload.data
      };

    default:
      return {
        ...state
      };
  }
};
