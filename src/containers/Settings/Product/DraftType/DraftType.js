import React from 'react';
import { connect } from 'react-redux';
import {
  Menu,
  Icon,
  Form,
  Input,
  Button,
  Table,
  Modal,
  Select,
  Radio,
  Breadcrumb
} from 'tapas-ui';

import { fieldsTypeColumns } from '../table-columns';
import TypeForm from './TypeForm';

import * as actionsForConfigs from '#/actions/configs';

const MenuItem = Menu.Item;
const BreadcrumbItem = Breadcrumb.Item;
const FormItem = Form.Item;
const Option = Select.Option;
const RadioGroup = Radio.Group;

class DraftType extends React.Component {
  constructor(props) {
    super(props);
    const drafts = [].concat(this.props.drafts).reverse();
    this.state = {
      current: drafts[0] ? drafts[0].id : undefined,
      openKeys: [],
      showModal: false,
      modalTitle: undefined,
      typeNew: false,
      formData: {
        name_zh: undefined,
        name_map: undefined,
        field_type: 'String',
        required: 'yes',
        default_value: undefined,
        widget: 'Text'
      },
      validateStatus: {
        name_zh: false,
        name_map: false
      }
    }
  }

  getDraftName(id) {
    const { drafts } = this.props;
    const ids = drafts.map(item => item.id);
    const position = ids.indexOf(id);
    return drafts[position].name;
  }

  // handle new type
  handleTypeNew() {
    this.setState({
      typeNew: !this.state.typeNew
    });
  }

  handleTypeNewClose(data) {
    this.setState({
      typeNew: false
    });
  }

  handleMenuClick(e) {
    this.setState({
      current: e.key,
      openKeys: e.keyPath.slice(1)
    }, () => {
      this.fetchCurrentFieldsData();
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
      const { name_zh, field_type, name_map, default_value ,widget } = formData;
      this.props.dispatch(
        this.state.currentField === null
          ? actionsForConfigs.fields.create({
              display_name: name_zh,
              default_value: default_value,
              type: field_type,
              mapping_name: name_map,
              input_type: widget,
              draftTypeId: this.state.current
          })
          : actionsForConfigs.fields.update({
            id: this.state.currentField.id,
            display_name: name_zh,
            default_value: default_value,
            type: field_type,
            mapping_name: name_map,
            input_type: widget,
            draftTypeId: this.state.current
          })
      );
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
      field_type: 'String',
      required: 'yes',
      default_value: undefined,
      widget: 'Text'
    };
    const validateStatus = {
      name_zh: false,
      name_map: false,
    };
    this.setState({
      showModal: true,
      modalTitle: '新建字段',
      formData: defaultFormData,
      validateStatus: validateStatus,
      currentField: null
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
      name_map: false
    };
    this.setState({
      showModal: true,
      modalTitle: '修改字段',
      formData: recordFormData,
      validateStatus: validateStatus,
      currentField: record
    })
  }

  handleFieldDelete(id) {
    // 获取到字段的id
    console.log(id);
  }

  fetchCurrentFieldsData() {
    if (this.state.current) {
      this.props.dispatch(actionsForConfigs.drafts.show({
        id: this.state.current
      }))
    }
  }

  componentDidMount() {
    this.fetchCurrentFieldsData();
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
            <Option value='String'>文本</Option>
            <Option value='Array'>文本数组</Option>
            <Option value='Boolean'>布尔值</Option>
          </Select>
        </FormItem>
        <FormItem
          label='是否必填：'
          labelCol={{span: 6}}
          wrapperCol={{span: 18}} >
            <RadioGroup
              value={formData.required}
              onChange={this.handleFormChange.bind(this, 'required')}>
              <Radio value='yes'>是</Radio>
              <Radio value='no'>否</Radio>
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
            <Option value='Text'>文本输入框</Option>
            <Option value='Richtext'>富文本编辑框</Option>
            <Option value='Tag'>标签</Option>
            <Option value='Upload'>上传图片</Option>
            <Option value='Switch'>开关</Option>
          </Select>
        </FormItem>
      </Form>
    );
  }

  render() {
    let data = this.props.fields
      ? this.props.fields.map( (item, index) => ({
          id: item.id,
          key: item.id,
          name_zh: item.displayName,
          name_map: item.mappingName,
          field_type: item.type,
          required: 'yes',
          default_value: item.defaultValue,
          widget: item.inputType,
          editable: !/^(title|content|summary)$/g.test(item.mappingName),
          onEdit: ::this.handleFieldEdit,
          onDelete: ::this.handleFieldDelete
        }))
      : [];
    const draftsReverse = [].concat(this.props.drafts).reverse();

    return (
      <div className='type'>
        <div className='menu'>
          <div className='new-type' onClick={::this.handleTypeNew}>新建稿件<Icon type='plus' /></div>
          { this.state.typeNew && <TypeForm onSave={::this.handleTypeNewClose} />}
          <Menu
            style={{width:240, height: (window.innerHeight - 346)}}
            onClick={::this.handleMenuClick}
            openKeys={this.state.openKeys}
            onOpen={::this.handleMenuToggle}
            onClose={::this.handleMenuToggle}
            selectedKeys={[this.state.current]}
            mode='inline'>
            {
              draftsReverse.map(item => {
                return <MenuItem key={item.id}>{item.name}</MenuItem>;
              })
            }
          </Menu>
        </div>
        {
          this.props.drafts[0]
            && <div className='table-content'>
                <div className='heading'>
                  <Breadcrumb>
                    <BreadcrumbItem>字段列表</BreadcrumbItem>
                  </Breadcrumb>
                  <Button type='primary' onClick={::this.handleFieldNew}>新建字段</Button>
                </div>
                <Table columns={fieldsTypeColumns} dataSource={data} pagination={false} />
              </div>
        }
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
}

export default connect(state => ({
  drafts: state.configs.drafts.data,
  fields: state.configs.fields.data
}))(DraftType);
