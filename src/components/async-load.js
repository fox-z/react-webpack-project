import React, { PureComponent } from 'react';

/**
 * 按需加载组件
 */
export default (loadComponent, placeholder = '') => {
  return class AsyncComponent extends PureComponent {
    constructor() {
      super();
      this.state = {
        Child: null,
      };
      this.static = {
        unmount: false,
      };
    }

    async componentDidMount() {
      const { default: Child } = await loadComponent();
      if (this.static.unmount) {
        return;
      }
      this.setState({
        Child,
      });
    }

    componentWillUnmount() {
      this.static.unmount = true;
    }

    render() {
      const { Child } = this.state;
      return (
        Child ? <Child {...this.props} /> : placeholder
      );
    }
  };
};
