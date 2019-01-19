import React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import {routes as EventRoutes} from './events';

import Menu from './sidepanel/menu';
import SubMenu from './sidepanel/submenu';

import {Session} from './auth/session';

let routes = [
  EventRoutes,
];

let Router = () => {

  return (
    <BrowserRouter>
      <React.Fragment>

        <Route component={Menu} />
        <div className='container'>
          <Route component={Session} />
          <SubMenu />
          <Switch>
          {
            [].concat.apply([], routes.map(route => route.props.children))
          }
          </Switch>
        </div>

      </React.Fragment>
    </BrowserRouter>
  );
}

export default Router;
