import React from 'react';
import {
  Menu,
  Icon,
  Button,
  Modal
} from 'tapas-ui';
import { Link } from 'react-router';

import DraftType from './DraftType';
import ProductDirectory from './Directory';
import ProductInfo from './Info';

const SubMenu = Menu.SubMenu;
const MenuItem = Menu.Item;

const Navigator = ({current, urlPrefix, handleClick}) => {
  const paddingLeft = (window.innerWidth - 960) * 0.5;
  const padding = `0 ${paddingLeft}px`;
  return (
    <Menu
      style={{padding: padding, fontSize: 14, backgroundColor: '#eee'}}
      mode='horizontal'
      selectedKeys={[current]}
      onClick={handleClick}>
      <SubMenu title={<span>产品A<Icon type='down' /></span>}>
        <Menu.Item key='product:1'><Link to={`${urlPrefix}/1`}>产品A</Link></Menu.Item>
        <Menu.Item key='product:2'><Link to={`${urlPrefix}/2`}>产品B</Link></Menu.Item>
        <Menu.Item key='product:3'><Link to={`${urlPrefix}/3`}>产品C</Link></Menu.Item>
        <Menu.Item key='product:4'><Link to={`${urlPrefix}/4`}>产品D</Link></Menu.Item>
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

export default class ProductItem extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      currentNav: 'info'
    }
  }

  render() {
    const { orgId, productId } = this.props.params
    return (
      <div className='setting-detail'>
        <Navigator urlPrefix={`/${orgId}/settings/product`} current={this.state.currentNav} handleClick={::this.handleNavClick} />
        <SwitchView current={this.state.currentNav} />
      </div>
    );
  }

  handleNavClick(e) {
    this.setState({
      currentNav: e.key
    });
  }
}
