import React from 'react';
import { Menu } from 'tapas-ui';
import Text from './Text.js';

import history from '../../utils/history';

const { SubMenu, Item } = Menu;

export default class Navigator extends React.Component {
  clickHandler(event) {
    history.push(event.key);
  }
  getFullPathname(path) {
    return `/${this.props.params.orgId}/${this.props.params.productId}/${path}`
  }
  getSelectedKeys() {
    const currentSelectedKey = this.props.location && this.props.location.pathname;
    return [currentSelectedKey];
  }
  getOpenKeys() {
    const currentOpenKey = this.props.routes && this.props.routes[4] && this.props.routes[4].path;
    return [currentOpenKey];
  }
  render() {
    const selectedKeys = this.getSelectedKeys();
    const openKeys = this.getOpenKeys();
    return (
      <Menu 
        mode="inline"
        theme="dark"
        onClick={::this.clickHandler}
        selectedKeys={selectedKeys}
        defaultOpenKeys={openKeys}
      >
        <SubMenu key="library" title={<Text text="内容库" type="appstore" />}>
          <Item key={this.getFullPathname('library/external')}>外部内容库</Item>
          <Item key={this.getFullPathname('library/internal')}>企业内容库</Item>
        </SubMenu>
        <SubMenu key="draft" title={<Text text="内容生产" type="appstore" />}>
          <Item key={this.getFullPathname('draft/001/new')}>新建普通稿件</Item>
          <Item key={this.getFullPathname('draft/002/new')}>新建直播稿件</Item>
          <Item key={this.getFullPathname('draft/list')}>草稿箱</Item>
        </SubMenu>
        <SubMenu key="distribution" title={<Text text="内容分发" type="appstore" />}>
          <Item key={this.getFullPathname('distribution/cate01')}>目录一</Item>
          <Item key={this.getFullPathname('distribution/cate02')}>目录二</Item>
        </SubMenu>
      </Menu>
    )
  }
}