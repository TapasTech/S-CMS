import React from 'react';
import { Menu, Icon, Form, Input, Button } from 'tapas-ui';

import Header from '#/components/Header/Header';
import BoxList from '#/components/BoxList/BoxList';

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
      mode="horizontal"
      selectedKeys={[current]}
      onClick={handleClick}>
      <Menu.Item key="product">
        产品端配置
      </Menu.Item>
      <Menu.Item key="enterprise">
        企业设置
      </Menu.Item>
      <Menu.Item key="member">
        成员管理
      </Menu.Item>
    </Menu>
  );
}

const ProductNavigator = ({current, handleClick}) => {
  const paddingLeft = (window.innerWidth - 960) * 0.5;
  const padding = `0 ${paddingLeft}px`;
  return (
    <Menu
      style={{padding: padding, fontSize: 14}}
      mode="horizontal"
      selectedKeys={[current]}
      onClick={handleClick}>
      <Menu.Item key="product">
        产品端配置
      </Menu.Item>
      <Menu.Item key="enterprise">
        企业设置
      </Menu.Item>
      <Menu.Item key="member">
        成员管理
      </Menu.Item>
    </Menu>
  );
}

const ProductSettings = ({ list, current, handleClick }) => {
  return (
    <div>
      <BoxList viewer={4} list={list} />
      <ProductNavigator current={current} handleClick={handleClick} />
    </div>
  );
}

const OrgSettings = ({ onNameChange, onDescChange, onSave }) => {
  return (
    <Form>
      <label>企业名称：</label>
      <FormItem>
        <Input type="text" onChange={onNameChange} />
      </FormItem>
      <label>企业介绍：</label>
      <FormItem>
        <Input type="text" onChange={onDescChange}  />
      </FormItem>
      <Button
        style={{width: 150, marginTop: 15}}
        type='primary'
        size='large'
        onClick={onSave}>保存</Button>
    </Form>
  );
}

const MemberSettings = (props) => {
  return (
    <div>Member</div>
  );
}

export default class Settings extends React.Component {

  static defaultProps = {
    list: [
      {title: '产品端A'},
      {title: '产品端B'},
      {title: '产品端C'},
      {title: '产品端D'},
      {title: '+添加产品端'}
    ]
  };

  static propTypes = {
    list: React.PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = {
      current: 'product',
      formData: {
        orgName: '',
        orgDesc: ''
      }
    }
  }

  renderView(current) {
    switch(current) {
      case 'enterprise':
        return (
          <OrgSettings
            onNameChange={::this.handleOrgNameChange}
            onDescChange={::this.handleOrgDescChange}
            onSave={::this.onSave} />
        );
        break;
      case 'member':
        return <MemberSettings />;
        break;
      default:
        return (
          <ProductSettings
            list={this.props.list}
            current={this.state.current}
            handleClick={::this.handleNavClick} />
        );
    }
  }

  render() {
    return (
      <div className='settings'>
        <Header title='S-CMS' />
        <Jumbotron name='企业名' desc='一句话描述企业' />
        <Navigator current={this.state.current} handleClick={::this.handleNavClick} />
        <div className='content'>
          {this.renderView(this.state.current)}
        </div>
      </div>
    )
  }

  handleNavClick(e) {
    this.setState({
      current: e.key
    });
  }

  handleOrgNameChange(e) {
    const value = e.target.value;
    let newFormData = Object.assign({}, this.state.formData);
    newFormData.orgName = value;
    this.setState({
      formData: newFormData
    });
  }

  handleOrgDescChange(e) {
    const value = e.target.value;
    let newFormData = Object.assign({}, this.state.formData);
    newFormData.orgDesc = value;
    this.setState({
      formData: newFormData
    });
  }

  onSave() {
    console.log('submit', this.state.formData);
  }
}
