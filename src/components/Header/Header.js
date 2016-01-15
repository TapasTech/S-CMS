import React from 'react';

import './style.less';

export default class Header extends React.Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='header'>{this.props.title}</div>
    );
  }
}
