import React from 'react';
import uuid from 'uuid';
import posed, {PoseGroup} from 'react-pose';
import {Link} from 'react-router-dom';
import {connect} from 'react-redux';

import {
  get_text
} from './format';

class TaskListItem extends React.Component {
  constructor(){
    super();

    this.PoseAnimation = posed.div({
      enter: { opacity:1 },
      exit: { opacity:0 },
    });
  }

  render(){
    let PoseAnimation = this.PoseAnimation;
    let pose_state = this.props.hidden ? 'hidden' : 'visible';
    // Keep only DOM valid props for the wrapping div
    let item_props = {...this.props};
    delete item_props.styles;

    return (
      <PoseAnimation {...item_props}>
        <div className={`${this.props.styles.status} fa fa-check-circle`} />
        <div className={`${this.props.styles.status} fa fa-times-circle`} />
        <div className={`${this.props.styles.status} fa fa-warning`} />
        <div className={`${this.props.styles.status} fa fa-refresh fa-spin`} />
        <div className={`${this.props.styles.status} fa fa-info-circle`} />
        <div className={`${this.props.styles.status} fa fa-arrows`} />
        <div className={this.props.styles.statusText}>
        {
          this.props.status_text 
          ? this.props.status_text 
          : null
        }
        {
          this.props.status_list && this.props.status_list.length
          ? <ul className={this.props.styles.statusList}>
            {
              this.props.status_list.map(value => {
                return (
                  <li key={uuid()}>
                    {value || <span>&nbsp;</span>}
                  </li>
                );
              })
            }
            </ul>
          : null
        }
        </div>
      </PoseAnimation>
    );
  }
}

class TaskList extends React.Component {
  constructor(){
    super();
  }

  renderList(items=[]){
    return items.map((item, index) => {
      let level = item.level.toLowerCase();
      let text = get_text(item);

      if(!text) return null;

      return (
        <TaskListItem
          key={item.id}
          hidden={item.hidden}
          data-status={level}
          status_text={text}
          status_list={item.status_list}
          className={this.props.styles.item}
          styles={this.props.styles}
          style={item.style} />
      );
    });
  }

  render(){
    return (
      <div className={this.props.styles.listBottomToTop}>
        <PoseGroup>
          {this.renderList(this.props.items)}
        </PoseGroup>
      </div>
    );
  }
}

export default TaskList;
