import {
  GET_TAG_LIST,
} from '../actions/tags';

const initial_state = {
  items: []
};

export default function (state = initial_state, action) {

  switch(action.type) {
    case GET_TAG_LIST:
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
