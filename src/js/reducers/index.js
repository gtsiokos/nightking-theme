import {combineReducers} from 'redux';

import {default as tags} from './tags';
import {default as tasks} from './tasks';
import {default as feeds} from './feeds';
import {default as events} from './events';
import {default as status} from './status';
import {default as sidepanel} from './sidepanel';

const reducers = combineReducers({
  tags,
  tasks,
  feeds,
  events,
  status,
  sidepanel
});

export default reducers;
