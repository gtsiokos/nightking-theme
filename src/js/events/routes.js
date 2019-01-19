import React from 'react';
import {Route} from 'react-router-dom';

import EventList from './list';

export default (
  <React.Fragment>
    <Route exact path='/events' component={EventList} />
  </React.Fragment>
);