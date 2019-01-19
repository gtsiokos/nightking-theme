import React from 'react';
import Button from './button';

import styles from '../../../../css/ui/button.css';

class WarningButton extends Button {
  constructor(){
    super();
  }

  render(){
    let cls = [
      styles.buttonWarning
    ].join(' ');

    return (
      <button className={cls} {...this.props}>
        {this.props.children}
      </button>
    );
  }
}

export default WarningButton;