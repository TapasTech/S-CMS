import React from 'react';

import './style.less';

export default class BoxList extends React.Component {
  static propTypes = {
    list: React.PropTypes.array,
    viewer: React.PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
    this._refs = {};
  }

  renderBox(item, index) {
    const { title, desc } = item;
    return (
      <div className='box' key={index}>
        <div
          ref={item => this._refs[title] = item}
          className='content'
          onClick={item.handleClick}>
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
