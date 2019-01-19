import React from 'react';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

import {Submenu as events} from '../events/ui';

import styles from '../../css/sidepanel.css';


class Submenu extends React.Component {

  constructor(){
    super();

    this.view = {
      'events': events,
    }

    this.viewProps = {
      'events': { display_filters: ['feed', 'status', 'tag', 'date'] },
    }
  }

  render(){
    let state = this.props.submenu_preview 
      ? this.props.submenu_preview 
      : this.props.submenu;
    //if(!state) return null;
    let submenu_style = {
      'flexBasis': state ? '440rem' : '0rem'
    };

    let View = this.view[state] || React.Fragment;
    let props = this.viewProps[state] || {};

    return (
      <div className={styles.submenuContainer} style={submenu_style}>
        <View {...props} />
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

Submenu = connect(mapStateToProps, {
})(Submenu);

export default Submenu;
