import React from 'react';
import { Menu, Icon, Form, Input, Button } from 'tapas-ui';
import { Link } from 'react-router';

import Header from '#/components/Header/Header';

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
        <div onClick={() => history.pushState(null, `/${orgId}/settings/product`)}>产品端配置</div>
      </Menu.Item>
      <Menu.Item key='enterprise'>
        <Link to={`/${orgId}/settings/organization`}>企业设置</Link>
      </Menu.Item>
      <Menu.Item key='member'>
        <div onClick={() => history.pushState(null, `/${orgId}/settings/member`)}>成员管理</div>
      </Menu.Item>
    </Menu>
  );
}

export default class SettingContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      current: 'product'
    }
  }

  render() {
    return (
      <div className='settings' style={{height: window.innerHeight}}>
        <Header title='S-CMS' />
        <Jumbotron name='企业名' desc='一句话描述企业' />
        <Navigator
          orgId={this.props.params.orgId}
          current={this.state.current}
          handleClick={::this.handleNavClick} />
        {this.props.children}
      </div>
    )
  }

  handleNavClick(item) {
    console.log(item)
    this.setState({
      current: item.key
    });
  }
}
