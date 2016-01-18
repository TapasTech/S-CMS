import React from 'react';
import { Menu, Icon, Form, Input, Button } from 'tapas-ui';
import { Link } from 'react-router';

import Header from '#/components/Header/Header';
import Avatar from '#/components/Avatar/Avatar';

import './style.less';

const FormItem = Form.Item;

const Jumbotron = ({ name, desc }) => {
  return (
    <div className='jumbotron'>
      <div className='notice'>
        <div className='name'>{name}</div>
        <div className='desc'>{desc}</div>
      </div>
    </div>
  );
}

const Navigator = ({current, handleClick, orgId}) => {
  const paddingLeft = (window.innerWidth - 960) * 0.5;
  const padding = `0 ${paddingLeft}px`;
  return (
    <Menu
      style={{padding: padding, fontSize: 14}}
      mode='horizontal'
      selectedKeys={[current]}
      onClick={handleClick}>
      <Menu.Item key='product'>
        <Link to={`/${orgId}/settings/product`}>产品端配置</Link>
      </Menu.Item>
      <Menu.Item key='organization'>
        <Link to={`/${orgId}/settings/organization`}>企业设置</Link>
      </Menu.Item>
      <Menu.Item key='member'>
        <Link to={`/${orgId}/settings/member`}>成员管理</Link>
      </Menu.Item>
    </Menu>
  );
}

export default class SettingContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      current: `${this.handleCurrent()}`
    }
  }

  render() {
    console.log(this.state.current)
    return (
      <div className='settings' style={{height: window.innerHeight}}>
        <Header title='S-CMS'>
          <Avatar name='张三' />
        </Header>
        <Jumbotron name='企业名' desc='一句话描述企业' />
        <Navigator
          orgId={this.props.params.orgId}
          current={this.state.current}
          handleClick={::this.handleNavClick} />
        {this.props.children}
      </div>
    )
  }

  handleCurrent() {
    const { route, routes } = this.props;
    const routesArray = routes.map(item => item.path);
    const position = routesArray.indexOf(route.path);
    return routesArray[position + 1]
  }

  handleNavClick(item) {
    console.log(item)
    this.setState({
      current: item.key
    });
  }
}
