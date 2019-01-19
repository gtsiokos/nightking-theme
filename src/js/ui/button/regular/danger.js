import React from 'react';
import Button from './button';

import styles from '../../../../css/ui/button.css';

class DangerButton extends Button {
  constructor(){
    super();
  }

  render(){
    let cls = [
      styles.buttonDanger
    ].join(' ');

    return (
      <button className={cls} {...this.props}>
        {this.props.children}
      </button>
    );
  }
}

export default DangerButton;