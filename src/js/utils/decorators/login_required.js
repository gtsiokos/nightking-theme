import React from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';

export default (Target) => {
  /*
   * Decorator component to redirect user to login form when session token becomes invalid.
   * Channel id is used as key prop to remount the decorated component when user switches channel.
   */
  /*
  class LoginRequiredDecorator extends React.Component {
    render() {
      return this.props.session.token
        ? <Target {...this.props} />
        : <Redirect to='/login' />;
    }
  }
  */
  class LoginRequiredDecorator extends React.Component {
    render() {
      return <Target {...this.props} />;
    }
  }

  /*
  return connect(state => {
    return {
      session: state.auth.session
    };
  })(LoginRequiredDecorator);
  */
  return LoginRequiredDecorator;
};
