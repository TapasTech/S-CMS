import React from 'react';
import { Link } from 'react-router';
import { Menu, Dropdown } from 'tapas-ui';

import Avatar from '../Avatar/Avatar';
import history from '#/utils/history';
import Restful from '#/utils/restful';

import './style.less';

const menu = <Menu>
  <Menu.Item key='0'>
    <Link to='/dashboard'>Dashboard</Link>
  </Menu.Item>
  <Menu.Item key='1'>
    <span>placeholder</span>
  </Menu.Item>
  <Menu.Divider/>
  <Menu.Item key='3'>
    <span onClick={clearToken}>退出登录</span>
  </Menu.Item>
</Menu>;

function clearToken() {
  localStorage.setItem('__AUTH', '');
  Restful.config({
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    }
  });
  history.pushState(null, '/login');
}

export default class Header extends React.Component {
  render() {
    return (
      <div className='header'>
        <div className='title'>
          <Link to='/dashboard'>S-CMS</Link>
        </div>
        <Dropdown overlay={menu} trigger={['click']}>
         <span><Avatar /></span>
        </Dropdown>
      </div>
    );
  }
}
