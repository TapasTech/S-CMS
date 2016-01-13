import React from 'react';
import { Icon } from 'tapas-ui';

export default class Text extends React.Component {
  render() {
    return (
      <span>
        <Icon type={this.props.type} />
        { this.props.text }
      </span>
    )
  }
}