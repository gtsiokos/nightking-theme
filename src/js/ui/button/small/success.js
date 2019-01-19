import React from 'react';
import Button from './button';

import styles from '../../../../css/ui/button.css';

class SuccessButton extends Button {
  constructor(){
    super();
  }

  render(){
    let cls = [
      styles.buttonSuccess,
      styles.buttonSmall
    ].join(' ');

    return (
      <button className={cls} {...this.props}>
        {this.props.children}
      </button>
    );
  }
}

export default SuccessButton;