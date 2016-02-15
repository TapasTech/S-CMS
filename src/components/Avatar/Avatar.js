import React from 'react';

import './style.less';

export default class Avatar extends React.Component {

  static propTypes = {
    name: React.PropTypes.string.isRequired,
    email: React.PropTypes.string,
    role: React.PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { name, email, role } = this.props;
    return (
      <div className='avatar-container'>
        <div className='avatar'>{name && name.substr(name.length - 1)}</div>
        <div className='desc'>
          { name && <div className='name'>{name}</div> }
          { role && <div className='role'>{role === 'admin' ? '管理员' : '普通用户'}</div> }
        </div>
        { email && <div className='email'>{email}</div> }
      </div>
    );
  }
}
