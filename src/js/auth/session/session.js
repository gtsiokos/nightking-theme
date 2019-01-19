import React from 'react';
import {Redirect} from 'react-router-dom';
import {connect} from 'react-redux';

import Header from '../../header';
import {
  AlertConnectionError
} from '../../ui/alerts';

import {
  error_catched_by
} from '../../utils/decorators';

import '../../../css/base.css';
import '../../../css/semantic-ui-theme.css';

@error_catched_by(AlertConnectionError)
class Session extends React.Component {

  constructor() {
    super();

    //this.redirectToSession  = this.redirectToSession.bind(this);
    //this.redirectToLogin    = this.redirectToLogin.bind(this);
    //this.onLogout           = this.onLogout.bind(this);
  }

  componentWillMount(){
    this.props.history.replace('/events')
  }

  /*
  componentWillMount(){
    this.redirectToSession(this.props.location.pathname)
  }

  componentWillReceiveProps(props){
    this.redirectToSession(props.location.pathname);
  }

  redirectToSession(path){
    let has_session = this.props.session.token;

    switch(path){
      case '/':
        if(has_session){
          this.props.history.replace('/events')
        } else {
          this.props.history.replace('/login')
        }
      case '/login':
        if(has_session){
          this.props.history.replace('/events');
        }
    }
  }

  redirectToLogin(){
    return Promise
      .resolve()
      .then(() => this.props.clear_session())
      .then(() => this.props.history.push('/login'));
  }

  onLogout() {
    return Promise
      .resolve()
      .then(() => this.props.logout(this.props.session.token))
      .then(() => this.redirectToLogin())
      .catch(() => this.redirectToLogin());
  }
  */

  render() {
    return (
      <Header username={this.props.session.username} onLogout={() => {}} />
    );
  }
}

function mapStateToProps(state, props) {
  return {
    session: {username:'Demo User'}
  };
}

export default connect(mapStateToProps, {})(Session);
