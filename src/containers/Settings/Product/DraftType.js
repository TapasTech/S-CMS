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
  Radio,
  Breadcrumb
} from 'tapas-ui';

import { fieldsTypeColumns } from './table-columns';

const MenuItem = Menu.Item;
const BreadcrumbItem = Breadcrumb.Item;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

const dataSource = [
  {
    id: '001',
    key: '1a',
    name_zh: '标题',
    name_map: 'title',
    field_type: '文本',
    required: 'true',
    default_value: undefined,
    widget: '文本输入框',
    editable: false,
  }, {
    id: '002',
    key: '2a',
    name_zh: '正文',
    name_map: 'content',
    field_type: '富文本',
    required: 'true',
    default_value: undefined,
    widget: '富文本编辑器',
    editable: false,
  }, {
    id: '003',
    key: '3a',
    name_zh: '新闻来源',
    name_map: 'origin',
    field_type: '文本',
    required: 'false',
    default_value: '第一财经｜CBN',
    widget: '文本输入框',
    editable: true,
  }
];

class TypeFrom extends React.Component {
  static propTypes = {
    onSave: React.PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        draft_name: undefined,
        type_name: 'regular'
      },
      validateStatus: {
        draft_name: false
      }
    }
  }

  render() {
    return (
      <Form horizontal className='type-form'>
        <FormItem
          hasFeedback
          validateStatus={this.state.validateStatus.draft_name ? 'error' : ''}
          help='请输入稿件类型名称'>
          <Input
            type='text'
            placeholder='稿件类型名称'
            value={this.state.formData.draft_name}
            onChange={this.handleFormChange.bind(this, 'draft_name')} />
        </FormItem>
        <div>稿件类型</div>
        <FormItem>
          <RadioGroup
            value={this.state.formData.type_name}
            onChange={this.handleFormChange.bind(this, 'type_name')}>
            <Radio value='regular'>普通稿件</Radio>
            <Radio value='live'>直播稿件</Radio>
          </RadioGroup>
        </FormItem>
        <Button type='primary' onClick={::this.handleOnSave}>创建</Button>
      </Form>
    );
  }

  // handle form value changes
  handleFormChange(name, e) {
    const value = e.target ? e.target.value : e;
    let newFormData = Object.assign({}, this.state.formData);
    newFormData[name] = value;
    this.setState({
      formData: newFormData
    });
  }

  handleOnSave() {
    const formData = this.state.formData
    const newValidateStatus = Object.assign({}, this.state.validateStatus);
    if (formData.draft_name) {
      newValidateStatus.draft_name = false;
      console.log('submit', formData);
      this.props.onSave(formData);
    } else {
      newValidateStatus.draft_name = true;
    }
    this.setState({
      validateStatus: newValidateStatus
    });
  }
}

export default class DraftType extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      current: '普通稿件',
      openKeys: [],
      showModal: false,
      modalTitle: undefined,
      typeNew: false,
      formData: {
        name_zh: undefined,
        name_map: undefined,
        field_type: 'text',
        required: 'true',
        default_value: undefined,
        widget: 'input_text'
      },
      validateStatus: {
        name_zh: false,
        name_map: false,
        default_value: false
      }
    }
  }

  renderFieldForm() {
    const formData = this.state.formData;
    const validateStatus = this.state.validateStatus
    return (
      <Form horizontal>
        <FormItem
          hasFeedback
          validateStatus={validateStatus.name_zh ? 'error' : ''}
          help='请输入字段中文名'
          label='字段中文名：'
          labelCol={{span: 6}}
          wrapperCol={{span: 14}}>
          <Input
            type='text'
            value={formData.name_zh}
            onChange={this.handleFormChange.bind(this, 'name_zh')}
            placeholder='字段中文名' />
        </FormItem>
        <FormItem
          hasFeedback
          validateStatus={validateStatus.name_map ? 'error' : ''}
          help='请输入映射名'
          label='映射名：'
          labelCol={{span: 6}}
          wrapperCol={{span: 14}}>
          <Input
            type='text'
            value={formData.name_map}
            onChange={this.handleFormChange.bind(this, 'name_map')}
            placeholder='映射名' />
        </FormItem>
        <FormItem
          label='字段类型：'
          labelCol={{span: 6}}
          wrapperCol={{span: 14}}>
          <Select
            style={{width:'100%'}}
            size='large'
            defaultValue={formData.field_type}
            value={formData.field_type}
            onChange={this.handleFormChange.bind(this, 'field_type')} >
            <Option value='text'>文本</Option>
            <Option value='text_array'>文本数组</Option>
            <Option value='boolean'>布尔值</Option>
          </Select>
        </FormItem>
        <FormItem
          label='是否必填：'
          labelCol={{span: 6}}
          wrapperCol={{span: 18}} >
            <RadioGroup
              value={formData.required}
              onChange={this.handleFormChange.bind(this, 'required')}>
              <Radio value='true'>是</Radio>
              <Radio value='false'>否</Radio>
            </RadioGroup>
        </FormItem>
        <FormItem
          hasFeedback
          validateStatus={validateStatus.default_value ? 'error' : ''}
          help='请输入默认值'
          label='默认值：'
          labelCol={{span: 6}}
          wrapperCol={{span: 14}}>
          <Input
            type='text'
            onChange={this.handleFormChange.bind(this, 'default_value')}
            value={formData.default_value}
            placeholder='默认值' />
        </FormItem>
        <FormItem
          label='控件：'
          labelCol={{span: 6}}
          wrapperCol={{span: 14}}>
          <Select
            style={{width:'100%'}}
            size='large'
            defaultValue={formData.widget}
            value={formData.widget}
            onChange={this.handleFormChange.bind(this, 'widget')} >
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
    const data = dataSource.map( (item, index) => {
      const newItem = Object.assign({}, item);
      newItem.key = index;
      newItem.onEdit = ::this.handleFieldEdit;
      newItem.onDelete = ::this.handleFieldDelete;
      return newItem;
    });

    return (
      <div className='type'>
        <div className='menu'>
          <div className='new-type' onClick={::this.handleTypeNew}>新建稿件<Icon type='plus' /></div>
          { this.state.typeNew && <TypeFrom onSave={::this.handleTypeNewClose} />}
          <Menu
            style={{width:240, height: (window.innerHeight - 346)}}
            onClick={::this.handleMenuClick}
            openKeys={this.state.openKeys}
            onOpen={::this.handleMenuToggle}
            onClose={::this.handleMenuToggle}
            selectedKeys={[this.state.current]}
            mode='inline'>
            <MenuItem key='普通稿件'>普通稿件</MenuItem>
            <MenuItem key='直播稿件'>直播稿件</MenuItem>
            <MenuItem key='自定义稿件'>自定义稿件</MenuItem>
          </Menu>
        </div>
        <div className='table-content'>
          <div className='heading'>
            <Breadcrumb>
              <BreadcrumbItem>{this.state.current}</BreadcrumbItem>
              <BreadcrumbItem>字段列表</BreadcrumbItem>
            </Breadcrumb>
            <Button type='primary' onClick={::this.handleFieldNew}>新建字段</Button>
          </div>
          <Table columns={fieldsTypeColumns} dataSource={data} pagination={false} />
        </div>
        <Modal
          title={this.state.modalTitle}
          visible={this.state.showModal}
          onOk={::this.handleModalEnsure}
          onCancel={::this.handleModalCancel}
          okText='确定'
          cancelText='取消'>
          {this.renderFieldForm()}
        </Modal>
      </div>
    );
  }

  // handle new type
  handleTypeNew(data) {
    console.log('submit', data)
    this.setState({
      typeNew: !this.state.typeNew
    });
  }

  handleTypeNewClose() {
    this.setState({
      typeNew: false
    });
  }

  handleMenuClick(e) {
    this.setState({
      current: e.key,
      openKeys: e.keyPath.slice(1)
    });
  }

  handleMenuToggle(info) {
    this.setState({
      openKeys: info.open ? info.keyPath : info.keyPath.slice(1)
    });
  }

  // handle form value changes
  handleFormChange(name, e) {
    const value = e.target ? e.target.value : e;
    let newFormData = Object.assign({}, this.state.formData);
    newFormData[name] = value;
    this.setState({
      formData: newFormData
    });
  }

  // handle modal state
  handleModalEnsure() {
    let passValidate = true;
    const newValidateStatus = Object.assign({}, this.state.validateStatus);
    const items = Object.keys(newValidateStatus);
    const formData = this.state.formData;
    items.forEach(item => {
      const itemValue = formData[`${item}`];
      // validate is empty or not
      if (itemValue) {
        newValidateStatus[`${item}`] = false;
      } else {
        newValidateStatus[`${item}`] = true;
        passValidate = false;
      }
    });
    if (passValidate) {
       // do actions
       console.log('submit', formData);
       this.setState({
        showModal: false,
        validateStatus: newValidateStatus
      });
    } else {
      console.log('new', newValidateStatus)
      this.setState({
        validateStatus: newValidateStatus
      });
    }
  }

  handleModalCancel() {
    this.setState({
      showModal: false
    })
  }

  // handle field changes
  handleFieldNew() {
    const defaultFormData = {
      name_zh: undefined,
      name_map: undefined,
      field_type: 'text',
      required: 'true',
      default_value: undefined,
      widget: 'input_text'
    };
    const validateStatus = {
      name_zh: false,
      name_map: false,
      default_value: false
    };
    this.setState({
      showModal: true,
      modalTitle: '新建字段',
      formData: defaultFormData,
      validateStatus: validateStatus
    })
  }

  handleFieldEdit(record) {
    const recordFormData = {
      name_zh: record.name_zh,
      name_map: record.name_map,
      field_type: record.field_type,
      required: record.required,
      default_value: record.default_value,
      widget: record.widget
    };
    const validateStatus = {
      name_zh: false,
      name_map: false,
      default_value: false
    };
    this.setState({
      showModal: true,
      modalTitle: '修改字段',
      formData: recordFormData,
      validateStatus: validateStatus
    })
  }

  handleFieldDelete(id) {
    // 获取到字段的id
    console.log(id);
  }
}
