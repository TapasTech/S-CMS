import React from 'react';

import './style.less';

const Role = ({ role }) => {
  return (
    <div className='role'>{role === 'admin' ? '管理员' : '普通用户'}</div>
  );
}

const Email = ({ email }) => {
  return (
    <div className='email'>{email}</div>
  );
}

const Avatar = ({ name, role, email }) => {
  return (
    <div className='avatar'>
      <div className='pic'>{name.substr(name.length - 1)}</div>
      <div className='desc'>
        <div className='name'>{name}</div>
        { role ? <Role role={role} /> : undefined }
      </div>
      { email ? <Email email={email} /> : undefined }
    </div>
  );
}

export default Avatar
