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

import DraftType from './DraftType';
import ProductDirectory from './ProductDirectory';
import ProductInfo from './ProductInfo';

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

export default class SettingDetails extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      currentNav: 'info',
      openKeys: [],
      showModal: true
    }
  }

  renderView(current) {
    switch(current) {
      case 'type':
        return <DraftType />
        break;
      case 'directory':
        return <ProductDirectory />
        break;
      default:
        return <ProductInfo />
    }
  }

  renderForm () {
    return (
      <Form horizontal>
        <FormItem
          label='字段中文名：'
          labelCol={{span: 6}}
          wrapperCol={{span: 14}}>
          <Input value='123' placeholder='字段中文名' />
        </FormItem>
        <FormItem
          label='映射名：'
          labelCol={{span: 6}}
          wrapperCol={{span: 14}}>
          <Input placeholder='映射名' />
        </FormItem>
        <FormItem
          label='字段类型：'
          labelCol={{span: 6}}
          wrapperCol={{span: 14}}>
          <Select id='select' size='large' defaultValue='text' style={{width:'100%'}} onChange={::this.handleSelectChange} >
            <Option value='text'>文本</Option>
            <Option value='text_array'>文本数组</Option>
            <Option value='boolean'>布尔值</Option>
          </Select>
        </FormItem>
        <FormItem
          label='是否必填：'
          labelCol={{span: 6}}
          wrapperCol={{span: 18}} >
            <RadioGroup value='a'>
              <Radio value='a'>是</Radio>
              <Radio value='b'>否</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem
          label='默认值：'
          labelCol={{span: 6}}
          wrapperCol={{span: 14}}>
          <Input placeholder='默认值' />
        </FormItem>
        <FormItem
          label='控件：'
          labelCol={{span: 6}}
          wrapperCol={{span: 14}}>
          <Select id='select' size='large' defaultValue='input_text' style={{width:'100%'}} onChange={::this.handleSelectChange} >
            <Option value='input_text'>文本输入框</Option>
            <Option value='rich_text'>富文本编辑框</Option>
            <Option value='tag'>标签</Option>
            <Option value='upload'>上传图片</Option>
            <Option value='on-off'>开关</Option>
          </Select>
        </FormItem>
      </Form>
    );
  }

  render() {
    return (
      <div className='setting-detail'>
        <Navigator current={this.state.currentNav} handleClick={::this.handleNavClick} />
        {this.renderView(this.state.currentNav)}
        <Modal
          title='添加字段'
          visible={this.state.showModal}
          onOk={::this.handleModalEnsure}
          onCancel={::this.handleModalCancel}
          okText='确定'
          cancelText='取消'>
        </Modal>
      </div>
    );
  }

  handleNavClick(e) {
    this.setState({
      currentNav: e.key
    });
  }

  handleModalEnsure() {
    this.setState({
      showModal: false
    })
  }

  handleModalCancel() {
    this.setState({
      showModal: false
    })
  }

  handleSelectChange(value) {
    console.log(value);
  }
}
