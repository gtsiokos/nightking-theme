import React from 'react';

import debounce from 'lodash/debounce';

class Viewport extends React.Component {

  constructor() {
    super();
  }

  componentWillMount(){
    this.orientation = window.matchMedia('only screen and (orientation:landscape)');

    this.orientation.addListener(debounce(() => {
      this.scale();
    }, 300)); 

    window.onresize = debounce(() => {
      this.scale();
    }, 300);
  }

  componentDidMount(){
    this.scale();
  }

  width(){
    return window.innerWidth;
  };

  height(){
    return window.innerHeight;
  };

  ratio(potrait_size, landscape_size){
    let scale = 1;
    let w = this.width();
    let h = this.height();
    let viewport_ratio = w/h;
    let v_w;
    let v_h;
    let view_ratio;

    if(this.orientation.matches){
      v_w = landscape_size[0];
      v_h = landscape_size[1];
    } else {
      v_w = potrait_size[0];
      v_h = potrait_size[1];
    }
    view_ratio = v_w/v_h;

    if(view_ratio < viewport_ratio){
      scale = h / v_h;
    } else {
      scale = w / v_w;
    }

    return scale;
  }

  scale(){
    let r = this.ratio(this.props.portrait, this.props.landscape);

    //if(is.Desktop && r>1.6){
    if(r>1.6){
      r = 1.6;
    }
    
    window.document.querySelector('html').style.fontSize = (100*r | 0)/100 + 'px';
  }

  render() {

    return (
      <div className={'viewport'}>
        {this.props.children}
      </div>
    );
  }
}

export default Viewport;