import {
  GET_STATUS_LIST,
} from '../actions/status';

const initial_state = {
  items: []
};

export default function (state = initial_state, action) {

  switch(action.type) {
    case GET_STATUS_LIST:
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
