import React from 'react';
import { Link } from 'react-router';

import './style.less';

export default class BoxList extends React.Component {
  static defaultProps = {
    list: [
      {title: 'Title', desc: 'this is a box view'},
      {title: 'Title', desc: 'this is a box view'},
      {title: 'Title', desc: 'this is a box view'},
      {title: 'Title', desc: 'this is a box view'},
      {title: 'Title', desc: 'this is a box view'},
      {title: 'Title', desc: ''}
    ]
  };

  static propTypes = {
    list: React.PropTypes.array,
    viewer: React.PropTypes.number.isRequired
  };

  constructor(props) {
    super(props);
  }

  renderBox({ title, desc }, index) {
    return (
      <div className='box' key={index}>
        <Link to='/login' className='content'>
          <div className='title'>{title}</div>
          <div className='desc'>{desc}</div>
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
