import React from 'react';
import { Link } from 'react-router';

import './style.less';

export default class BoxList extends React.Component {
  static defaultProps = {
    list: []
  };

  static propTypes = {
    list: React.PropTypes.array,
    viewer: React.PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
  }

  renderBox({ name, description }, index) {
    return (
      <div className='box' key={index}>
        <Link to='/login' className='content'>
          <div className='title'>{name}</div>
          <div className='desc'>{description}</div>
        </Link>
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
