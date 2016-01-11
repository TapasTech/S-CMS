import React from 'react';
import { Row, Col } from 'tapas-ui';

import './style.less'

export default class AccountContainer extends React.Component {
  static propTypes = {
    title: React.PropTypes.string.isRequired
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className='account-container' style={{height: window.innerHeight}}>
        <div className='account'>
          <div className='heading'>
            <p className='title'>S-CMS</p>
            <p className='desc'>最好用的免费内容管理系统</p>
          </div>
          <div className='content'>
            <div className='title'>{this.props.title}</div>
            <div className='form'>
              {this.props.children}
            </div>
          </div>
        </div>
      </div>
    );
  }
}
