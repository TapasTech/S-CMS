import React from 'react';
import {
  Menu,
  Icon,
  Form,
  Input,
  Button,
  Table,
  Modal,
  Popconfirm,
  Select,
  Radio
} from 'tapas-ui';

import BoxList from '#/components/BoxList/BoxList';
import DraftType from './DraftType';
import ProductDirectory from './Directory';
import ProductInfo from './Info';

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

const SwitchView = ({current, newField}) => {
  switch(current) {
    case 'type':
      return <DraftType newField={newField} />
      break;
    case 'directory':
      return <ProductDirectory />
      break;
    default:
      return <ProductInfo />
  }
}

const SettingDetails = (props) => {
  return (
    <div className='setting-detail'>
      <Navigator current={props.current} handleClick={props.handleClick} />
      <SwitchView current={props.current} newField={props.newField} />
      <Modal
        title={props.title}
        visible={props.showModal}
        onOk={props.onOk}
        onCancel={props.onCancel}
        okText='确定'
        cancelText='取消'>
        {props.children}
      </Modal>
    </div>
  );
}

export default class ProductSettings extends React.Component {
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
      detail: true,
      currentNav: 'info',
      modal: {
        show: false,
        title: undefined,
        content: undefined
      }
    }
  }

  render() {
    return (
      <div>
        {
          this.state.detail
          ? <SettingDetails
              current={this.state.currentNav}
              title={this.state.modal.title}
              showModal={this.state.modal.show}
              handleClick={::this.handleNavClick}
              onOk={::this.handleModalEnsure}
              onCancel={::this.handleModalCancel}
              newField={::this.handleFieldNew}>
              {this.state.modal.content}
            </SettingDetails>
          : <BoxList viewer={4} list={this.props.list} />
        }
      </div>
    );
  }

  handleNavClick(e) {
    this.setState({
      currentNav: e.key
    });
  }

  handleModalEnsure() {
    let newModal = Object.assign({}, this.state.modal);
    newModal.show = false;
    this.setState({
      modal: newModal
    });
  }

  handleModalCancel() {
    this.setState({
      showModal: false
    })
  }

  handleFieldNew(title, form) {
    let newModal = Object.assign({}, this.state.modal);
    newModal.show = true;
    newModal.title = title;
    newModal.content = form;
    this.setState({
      modal: newModal
    });
  }
}
