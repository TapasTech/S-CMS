import React from 'react';
import { Link } from 'react-router';

import './style.less';

const Header = (props) => {
  return (
    <div className='header'>
      <div className='title'>
        <Link to="/dashboard">{props.title}</Link>
      </div>
      {props.children}
    </div>
  );
}

export default Header
