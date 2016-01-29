import React from 'react';
import { Link } from 'react-router';

import './style.less';

export default class BoxList extends React.Component {
  static propTypes = {
    list: React.PropTypes.array,
    viewer: React.PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
  }

  renderBox({ title, desc, handleClick }, index) {
    return (
      <div className='box' key={index}>
        <div className='content' onClick={handleClick}>
          <div className='title'>{title}</div>
          <div className='desc'>{desc}</div>
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className={`list-box viewer-${this.props.viewer}`}>
        {
          this.props.list.map((item, index) => {
            return this.renderBox(item, index);
          })
        }
      </div>
    );
  }
}
