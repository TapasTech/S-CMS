import React from 'react';
import {
  Menu,
  Icon,
  Form,
  Input,
  Button,
  Table,
  Breadcrumb,
  Modal,
  Popconfirm,
  Select,
  Radio
} from 'tapas-ui';

import { directoryColumns, fieldsTypeColumns } from './table-columns';
import './style.less';

const SubMenu = Menu.SubMenu;
const FormItem = Form.Item;
const Option = Select.Option;
const MenuItem = Menu.Item;
const RadioGroup = Radio.Group;
const BreadcrumbItem = Breadcrumb.Item;

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

const InfoSettings = ({ onNameChange, onDescChange, onSave }) => {
  return (
    <Form className='content'>
      <label>产品端名称：</label>
      <FormItem>
        <Input type='text' onChange={onNameChange} />
      </FormItem>
      <label>产品端介绍：</label>
      <FormItem>
        <Input type='text' onChange={onDescChange}  />
      </FormItem>
      <Button
        style={{width: 150, marginTop: 15}}
        type='primary'
        size='large'
        onClick={onSave}>保存</Button>
    </Form>
  );
}

const TypeSettings = (props) => {
  return (
    <div className='type'>
      <div className='menu'>
        <Menu
          style={{width:240, height: (window.innerHeight - 346)}}
          onClick={props.handleClick}
          openKeys={props.openKeys}
          onOpen={props.onToggle}
          onClose={props.onToggle}
          selectedKeys={[props.current]}
          mode='inline'>
          <MenuItem key='type:new'><div className='new-type'>新建稿件<Icon type='plus' /></div></MenuItem>
          <MenuItem key='type:normal'>普通稿件</MenuItem>
          <MenuItem key='type:live'>直播稿件</MenuItem>
          <MenuItem key='type:custom'>自定义稿件</MenuItem>
        </Menu>
      </div>
      <div className='table-content'>
        <div className='heading'>
          <Breadcrumb>
            <BreadcrumbItem>{props.current}</BreadcrumbItem>
            <BreadcrumbItem>字段列表</BreadcrumbItem>
          </Breadcrumb>
          <Button type='primary' size='large' onClick={props.handleFieldNew}>新建字段</Button>
        </div>
        <Table columns={props.columns} dataSource={props.data} pagination={false} />
      </div>
    </div>
  );
}

const DirectorySettings = ({ columns, data }) => {
  return (
    <div className='directory'>
      <div className='heading'>
        <div className='title'>目录</div>
        <Button type='primary'>+ 添加目录</Button>
      </div>
      <Table columns={columns} dataSource={data} />
    </div>
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
      currentMenu: 'type:normal',
      openKeys: [],
      showModal: false,
      formData: {
        name: '',
        desc: ''
      }
    }
  }

  renderView(current) {
    switch(current) {
      case 'type':
        const dataType = [{
          id: '12',
          key: '1a',
          name_zh: '标题',
          name_map: 'title',
          field_type: '文本',
          required: true,
          default_value: undefined,
          widget: '文本输入框',
          editable: false,
          onEdit: ::this.handleFieldEditClick,
          onDelete: ::this.handleFieldDeleteClick
        }, {
          id: '13',
          key: '2a',
          name_zh: '正文',
          name_map: 'content',
          field_type: '富文本',
          required: true,
          default_value: undefined,
          widget: '富文本编辑器',
          editable: false,
          onEdit: ::this.handleFieldEditClick,
          onDelete: ::this.handleFieldDeleteClick
        },{
          id: '14',
          key: '3a',
          name_zh: '新闻来源',
          name_map: 'origin',
          field_type: '文本',
          required: false,
          default_value: '第一财经｜CBN',
          widget: '文本输入框',
          editable: true,
          onEdit: ::this.handleFieldEditClick,
          onDelete: ::this.handleFieldDeleteClick
        }];
        return (
          <TypeSettings
            columns={fieldsTypeColumns}
            data={dataType}
            handleClick={::this.handleMenuClick}
            openKeys={this.state.openKeys}
            onToggle={::this.handleMenuToggle}
            current={this.state.currentMenu}
            handleFieldNew = {::this.handleFieldNew}/>
        );
        break;
      case 'directory':
        const dataDirectory = [{
          id: '12',
          key: '1',
          name_zh: '编辑精选',
          name_en: 'editors_choice'
        }, {
          id: '13',
          key: '2',
          name_zh: '千人千面',
          name_en: 'recommendation'
        }, {
          id: '14',
          key: '3',
          name_zh: '热门新闻',
          name_en: 'hot_news'
        }];

        const pagination = {
          total: dataDirectory.length,
          current: 1,
          onShowSizeChange: function(current, pageSize) {
            console.log('Current: ', current, '; PageSize: ', pageSize);
          }
        };
        return <DirectorySettings columns={directoryColumns} data={dataDirectory} pagination={pagination} />;
        break;
      default:
        return (
          <InfoSettings
            onNameChange={::this.handleNameChange}
            onDescChange={::this.handleDescChange}
            onSave={::this.handleSaveClick} />
        );
    }
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
        </Modal>
      </div>
    );
  }

  handleNavClick(e) {
    this.setState({
      currentNav: e.key
    });
  }

  handleNameChange(e) {
    const value = e.target.value;
    let newFormData = Object.assign({}, this.state.formData);
    newFormData.orgName = value;
    this.setState({
      formData: newFormData
    });
  }

  handleDescChange(e) {
    const value = e.target.value;
    let newFormData = Object.assign({}, this.state.formData);
    newFormData.orgDesc = value;
    this.setState({
      formData: newFormData
    });
  }

  handleSaveClick() {
    console.log('submit', this.state.formData);
  }

  handleMenuClick(e) {
    this.setState({
      currentMenu: e.key,
      openKeys: e.keyPath.slice(1)
    });
  }

  handleMenuToggle(info) {
    this.setState({
      openKeys: info.open ? info.keyPath : info.keyPath.slice(1)
    });
  }

  handleFieldEditClick(record) {
    // 获取该字段全部内容
    console.log(record);
    this.setState({
      showModal: true
    })
  }

  handleFieldDeleteClick(id) {
    // 获取到字段的id
    console.log(id);
  }

  handleFieldNew() {
    this.setState({
      showModal: true
    })
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
