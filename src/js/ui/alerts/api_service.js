import React from 'react';
import {connect} from 'react-redux';

import TaskList from '../../tasks/list';

import {
  PrimaryButton
} from '../button/regular';
import {
  ButtonGroup
} from '../button/group';

import {
  TASK_API_REQUEST
} from '../../tasks/types';

import {
  new_task,
  update_task ,
  clear_task_by_type
} from '../../actions/tasks';

import styles from '../../../css/tasks.css';

class AlertApiService extends React.Component {
  constructor(){
    super();
  }

  componentWillMount(){
    this.props.bindParent(this);
  }

  render() {
    //console.log(this.props.tasks)
    return (
      <React.Fragment>
        {this.props.children}
        <TaskList items={this.props.tasks} styles={styles} />
      </React.Fragment>
    );
  }
}

function mapStateToProps(state, props) {
  return {
    tasks: state.tasks.items.filter(task => task.type == TASK_API_REQUEST)
  };
}

export default connect(
  mapStateToProps,
  {
    new_task,
    update_task,
    clear_task_by_type
  }
)(AlertApiService);