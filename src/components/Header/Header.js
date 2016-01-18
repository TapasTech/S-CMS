import React from 'react';

import './style.less';

const Header = (props) => {
  return (
    <div className='header'>
      <div className='title'>{props.title}</div>
      {props.children}
    </div>
  );
}

export default Header
