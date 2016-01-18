import React from 'react';
import {
  Menu,
  Icon,
  Form,
  Input,
  Button,
  Table,
  Popconfirm,
  Select,
  Radio
} from 'tapas-ui';

import BoxList from '#/components/BoxList/BoxList';

import DraftType from './DraftType';
import ProductDirectory from './Directory';
import ProductInfo from './Info';

export const ProductList = (props) => {
  const list = [
    {title: '产品端A'},
    {title: '产品端B'},
    {title: '产品端C'},
    {title: '产品端D'},
    {title: '+添加产品端'}
  ];
  return (
    <div className='content'>
      <BoxList viewer={4} list={list} />
    </div>
  );
}

const SubMenu = Menu.SubMenu;
const FormItem = Form.Item;
const Option = Select.Option;
const MenuItem = Menu.Item;
const RadioGroup = Radio.Group;

const Navigator = ({current, handleClick}) => {
  const paddingLeft = (window.innerWidth - 960) * 0.5;
  const padding = `0 ${paddingLeft}px`;
  return (
    <Menu
      style={{padding: padding, fontSize: 14, backgroundColor: '#eee'}}
      mode='horizontal'
      selectedKeys={[current]}
      onClick={handleClick}>
      <SubMenu title={<span>产品A<Icon type='down' /></span>}>
        <Menu.Item key='product:1'>产品A</Menu.Item>
        <Menu.Item key='product:2'>产品B</Menu.Item>
        <Menu.Item key='product:3'>产品C</Menu.Item>
        <Menu.Item key='product:4'>产品D</Menu.Item>
      </SubMenu>
      <Menu.Item key='info'>
        信息
      </Menu.Item>
      <Menu.Item key='type'>
        稿件类型
      </Menu.Item>
      <Menu.Item key='directory'>
        目录
      </Menu.Item>
    </Menu>
  );
}

const SwitchView = ({current}) => {
  switch(current) {
    case 'type':
      return <DraftType />;
      break;
    case 'directory':
      return <ProductDirectory />;
      break;
    default:
      return <ProductInfo />;
  }
}

export class ProductItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentNav: 'info'
    }
  }

  render() {
    return (
      <div className='setting-detail'>
        <Navigator current={this.state.current} handleClick={::this.handleNavClick} />
        <SwitchView current={this.state.current} />
      </div>
    );
  }

  handleNavClick(e) {
    this.setState({
      currentNav: e.key
    });
  }
}
