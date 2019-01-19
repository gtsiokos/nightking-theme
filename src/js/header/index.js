import React from 'react';
import {connect} from 'react-redux';
import {Link} from 'react-router-dom';
import {Dropdown} from 'semantic-ui-react';
import debounce from 'lodash/debounce';

import styles from '../../css/header.css';

class Header extends React.Component {

  constructor(){
    super();

    this.state = {
      user_menu_is_open: false,
      send_eventcard_tooltip: false
    };

    [
      'renderActionCenterButton',
      'renderUserMenu'
    ].forEach(func => this[func] = this[func].bind(this));
  }

  onLogout(event) {
    if (event) {
      event.preventDefault();
    }

    this.props.onLogout();
  }

  renderActionCenterButton(){
    let style = {
      marginLeft: 'auto',
      marginRight: '0',
      opacity: 0
    };

    return (
      <div className={styles.button} style={style}>
        <span className='fa fa-bell' />
      </div>
    );
  }

  renderUserMenu(user) {
    let options = [
      { 
        key:'settings', 
        value: 'settings', 
        text:'Settings', 
        disabled: true,
        icon: <span className='fa fa-cog'></span>, 
        onClick: () => {}
      },
      { 
        key:'logout', 
        value: 'logout', 
        text:'Logout', 
        disabled: true,
        icon: <span className='fa fa-sign-out'></span>, 
        onClick: () => {}
      }
    ];

    let style = {
      marginRight: '11rem'
    };

    let trigger = 
      <React.Fragment>
        <span className='fa fa-user-circle-o'></span>
        <span>{user}</span>
      </React.Fragment>;

    return (
      <Dropdown 
        simple
        icon={null}
        pointing={'top'}
        style={style}
        options={options} 
        trigger={trigger}
        className={styles.userButton}/>
    );
  }

  render() {
    return (
      <div className={styles.panel}>
        {this.renderActionCenterButton()}
        {this.renderUserMenu(this.props.username)}
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {};
}

export default connect(mapStateToProps, {})(Header);
