import React from 'react';
import {once} from 'lodash';

export default (...handlers) => (Target) => {

  /*
   * Wraps the child component with a empty React.Component that uses
   * React 16 error boundary functionality to propagate catched errors to the respective handlers.
   *
   * {@link https://reactjs.org/docs/error-boundaries.html}
   */
  class ErrorCatch extends React.Component {

    componentDidCatch(error, errorInfo){
      this.props.onError(error, errorInfo);
    }

    render() {
      return this.props.children;
    }

  }

  /*
   * Decorator component wraps the child React component with N amount of nested React components passed as arguments.
   * @param {Object[]} handlers React components that wrap the child component.
   */
  class ErrorCatchedByDecorator extends React.Component {
    constructor(){
      super();

      this._catched = false;
      this._children = [];

      handlers.reverse() // :)

      this.onError = once(this.onError.bind(this))
    }

    onError(error, errorInfo){
      this._catched = true;
      this._children.forEach(child => {
        if(child.onError){
          child.onError(error, errorInfo);
        }
      });
    }

    render() {
      let handler_props = {
        bindParent: (child) => this._children.push(child),
        ...this.props
      };

      let catch_props = {
        onError: this.onError
      };

      return (
        /* 
         * Returns the nested component wrapped with the provided handlers
         * Resulting structure will be:
         * <Handler_N>
         *  ...
         *    ...
         *      <Handler_0>
         *        <ErrorCatch>
         *          <Target />
         *        </ErrorCatch>
         *      </Handler_0>
         *    ...
         *  ...
         * </Handler_N>
         */
        handlers
          .reduce((TargetComponent, Component) => {
            return React.createElement(Component, {...handler_props}, TargetComponent);
          }, React.createElement(ErrorCatch, {...catch_props},
                this._catched ? null : React.createElement(Target, this.props)
            )
          )
      );
    }
  }

  return ErrorCatchedByDecorator;
}