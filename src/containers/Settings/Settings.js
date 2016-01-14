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

const Navigator = ({current, handleClick}) => {
  const paddingLeft = (window.innerWidth - 960) * 0.5;
  const padding = `0 ${paddingLeft}px`;
  return (
    <Menu
      style={{padding: padding, fontSize: 14}}
      mode='horizontal'
      selectedKeys={[current]}
      onClick={handleClick}>
      <Menu.Item key='product'>
        <Link to='1234/settings/product/1234'>产品端配置</Link>
      </Menu.Item>
      <Menu.Item key='enterprise'>
        <Link to='settings/organzation'>企业设置</Link>
      </Menu.Item>
      <Menu.Item key='member'>
        <Link to='settings/member'>成员管理</Link>
      </Menu.Item>
    </Menu>
  );
}

export default class Settings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      current: 'product'
    }
  }

  renderView(current) {
    switch(current) {
      case 'enterprise':
        return (
          <OrgSettings
            onNameChange={::this.handleOrgNameChange}
            onDescChange={::this.handleOrgDescChange}
            onSave={::this.handleSaveClick} />
        );
        break;
      case 'member':
        return <MemberSettings />;
        break;
      default:
        return <ProductSettings list={this.props.list} detail={true}></ProductSettings>;
    }
  }

  render() {
    return (
      <div className='settings' style={{height: window.innerHeight}}>
        <Header title='S-CMS' />
        <Jumbotron name='企业名' desc='一句话描述企业' />
        <Navigator current={this.state.current} handleClick={::this.handleNavClick} />
        {this.props.children}
      </div>
    )
  }

  handleNavClick(e) {
    this.setState({
      current: e.key
    });
  }
}
