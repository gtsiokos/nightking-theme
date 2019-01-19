import React from 'react';
import {connect} from 'react-redux';
import DropModal from 'reboron/DropModal';
import uuid from 'uuid';

import modal from '../../../css/modal.css';

import {
  TASK_ALERT_CONNECTION_ERROR
} from '../../tasks/types';

import {
  new_task,
  update_task,
  clear_task_by_type
} from '../../actions/tasks';

class AlertConnectionError extends React.Component {
  constructor(){
    super();

    this.is_online = window.navigator.onLine;

    window.addEventListener('online', ev => {
      this.is_online = true;
      this.props.clear_task_by_type(TASK_ALERT_CONNECTION_ERROR);
    });

    window.addEventListener('offline', ev => {
      this.is_online = false;
      //log('core:error', 'No internet connection');
      this.props.new_task({
        id: uuid(),
        type: TASK_ALERT_CONNECTION_ERROR
      });
    });

  }

  componentWillMount(){
    this.props.bindParent(this);
  }

  componentWillReceiveProps(props){
    if(props.tasks.length){
      this.refs.modal.show();
    } else {
      this.refs.modal.hide();
    }
  }

  render() {
    return (
      <React.Fragment>
        {this.props.children}
        <DropModal ref='modal' closeOnClick={false} className={modal.panel}>
          <div className='row row-top-7'>
            <h4>{'No Connection'}</h4>
          </div>
          <div className='row'>
            <p>{'Check your network connection and refresh the page to continue.'}</p>
          </div>
        </DropModal>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    tasks: state.tasks.items.filter(task => task.type == TASK_ALERT_CONNECTION_ERROR)
  };
}

export default connect(
  mapStateToProps,
  {
    new_task,
    update_task,
    clear_task_by_type
  }
)(AlertConnectionError);