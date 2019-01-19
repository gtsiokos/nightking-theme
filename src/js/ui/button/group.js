import React from 'react';

import styles from '../../../css/ui/button.css';

class ButtonGroup extends React.Component {
  constructor(){
    super();
  }

  render(){
    let cls = !this.props.align
      ? styles.buttonGroupLeft 
      : this.props.align == 'left'
        ? styles.buttonGroupLeft
        : styles.buttonGroupRight;

    return (
      <div className={cls}>
        {this.props.children}
      </div>
    );
  }
}

export {ButtonGroup as ButtonGroup};