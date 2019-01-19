import React from 'react';
import {connect} from 'react-redux';
import {Link, NavLink} from 'react-router-dom';

import {
  open_submenu,
  preview_submenu
} from '../actions/sidepanel';

import Submenu from './submenu';
import styles from '../../css/sidepanel.css';


class Menu extends React.Component {

  constructor(){
    super();

    [
      'onOpenSubmenu',
      'onPreviewSubmenu',
      'renderLinks',
    ].forEach(func => this[func] = this[func].bind(this));
  }

  componentWillMount(){
    let linkgroup = this.linkgroups.find(
      linkgroup => linkgroup[0][2] == this.props.location.pathname
    );

    if(linkgroup && linkgroup[0][3]){
      this.props.open_submenu(linkgroup[0][2].substring(1));
    }
  }

  componentWillReceiveProps(props){
    let path = props.location.pathname;

    if(path != this.props.pathname){
      let linkgroup = this.linkgroups.find(
        linkgroup => linkgroup[0][2] == path
      );

      if(linkgroup && linkgroup[0][3]){
        this.props.open_submenu(linkgroup[0][2].substring(1));
      }
    }
  }

  get linkgroups() {
    let has_submenu = val => val;

    return [
      [
        ['fa fa-list', 'Events List', '/events', has_submenu(true)]
      ],
      [
        ['fa fa-calendar', 'Calendar', '/calendar', has_submenu(false)]
      ],
      [
        ['fa fa-map-marker', 'Map', '/map', has_submenu(false)]
      ],
      [
        ['fa fa-bar-chart', 'Statistics', '/statistics', has_submenu(false)]
      ],
    ];
  }

  onOpenSubmenu(value){
    this.props.open_submenu(value)
  }

  onPreviewSubmenu(value){
    //this.props.preview_submenu(value)
  }

  renderLinks(){
    let links = this.linkgroups.map( (linkgroup, index) => {
      //console.log(linkgroup)
      let onClick = () => {
        // If a route has submenu trigger the open action to display it
        // Else trigger the open action to hide the previous submenu
        return linkgroup[0][3] ? this.onOpenSubmenu(name) : this.onOpenSubmenu(null);
      }

      let onMouseOver = () => {
        // If a route has submenu trigger the preview action to display it
        // Else noop
        return linkgroup[0][3] ? this.onPreviewSubmenu(name) : null;
      }

      let onMouseOut = () => {
        // Trigger the preview action to hide the previous submenu
        return this.onPreviewSubmenu(null);
      }

      let name = linkgroup[0][2].substring(1);

      return (
        <li
          key={index}
          onClick={onClick}
          onMouseOut={onMouseOut}
          onMouseOver={onMouseOver}>
          <NavLink 
            exact
            tabIndex={-1} 
            className={styles.menuListItem}
            activeClassName={styles.menuListItemActive}
            to={linkgroup[0][2]}>
            <span className={linkgroup[0][0]}></span>
          </NavLink>
        </li>
      );
    });

    return (
      <ul className={styles.menuList}>{links}</ul>
    );
  }

  render(){
    let state = this.props.submenu_preview 
      ? this.props.submenu_preview 
      : this.props.submenu;

    let submenu_style = {
      'flexBasis': state ? '490rem' : '0rem'
    };

    return (
      <div className={styles.panel}>
        <Link tabIndex={-1} className={styles.menuLogo} to='/events'>
          <img src='/static/img/logo.png' alt='' />
        </Link>
        {this.renderLinks()}
      </div>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    submenu: state.sidepanel.submenu,
    submenu_preview: state.sidepanel.submenu_preview
  };
}

Menu = connect(mapStateToProps, {
  open_submenu,
  preview_submenu
})(Menu);

export default Menu;
