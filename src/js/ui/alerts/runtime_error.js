import React from 'react';
import {connect} from 'react-redux';
import DropModal from 'reboron/DropModal';
import uuid from 'uuid';

import {
  PrimaryButton
} from '../button/regular';
import {
  ButtonGroup
} from '../button/group';

import modal from '../../../css/modal.css';

import {
  TASK_ALERT_RUNTIME_ERROR
} from '../../tasks/types';

import {
  new_task,
  update_task ,
  clear_task_by_type
} from '../../actions/tasks';

class AlertRuntimeError extends React.Component {
  constructor(){
    super();

    this.onReload = this.onReload.bind(this);
    this.onError = this.onError.bind(this);
  }

  componentWillMount(){
    this.props.bindParent(this);
  }

  onError(error, errorInfo){
    this.props.new_task({
      id: uuid(),
      type: TASK_ALERT_RUNTIME_ERROR,
      data: {error, errorInfo}
    });
  }

  componentWillReceiveProps(props){
    if(props.tasks.length){
      this.refs.modal.show();
    }
  }

  onReload(){
    window.location.reload();
  }

  render() {
    return (
      <React.Fragment>
        {this.props.children}
        <DropModal ref='modal' className={modal.panel}>
          <div className='row row-top-7'>
            <h4>{'Unexpected Error'}</h4>
          </div>
          <div className='row'>
            <p>{'Refresh the page to continue.'}</p>
          </div>
          <ButtonGroup align='right'>
            <PrimaryButton onClick={this.onReload}>Reload</PrimaryButton>
          </ButtonGroup>
        </DropModal>
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    tasks: state.tasks.items.filter(task => task.type == TASK_ALERT_RUNTIME_ERROR)
  };
}

export default connect(
  mapStateToProps,
  {
    new_task,
    update_task,
    clear_task_by_type
  }
)(AlertRuntimeError);