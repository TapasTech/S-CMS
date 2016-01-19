import React from 'react';
import {
  Button,
  Table,
  Modal,
  Form,
  Input
} from 'tapas-ui';

import { directoryColumns } from '../table-columns';

const dataSource = [{
  id: '102',
  key: '1',
  name_zh: '编辑精选',
  name_map: 'editors_choice',
  editable: false,
}, {
  id: '103',
  key: '2',
  name_zh: '千人千面',
  name_map: 'recommendation',
  editable: true
}, {
  id: '104',
  key: '3',
  name_zh: '热门新闻',
  name_map: 'hot_news',
  editable: true
}];

const FormItem = Form.Item;

export default class ProductDirectory extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      modalTitle: undefined,
      formData: {
        name_zh: undefined,
        name_map: undefined
      },
      validateStatus: {
        name_zh: false,
        name_map: false
      }
    }
  }

  renderForm () {
    const formData = this.state.formData;
    const validateStatus = this.state.validateStatus;
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
      </Form>
    );
  }

  render() {
    const data = dataSource.map( (item, index) => {
      const newItem = Object.assign({}, item);
      newItem.key = index;
      newItem.onEdit = ::this.handleDirectoryEdit;
      newItem.onDelete = ::this.handleDirectoryDelete;
      return newItem;
    });

    const pagination = {
      total: data.length,
      current: 1,
      onShowSizeChange: function(current, pageSize) {
        console.log('Current: ', current, '; PageSize: ', pageSize);
      }
    };

    return (
      <div className='directory'>
        <div className='heading'>
          <div className='title'>目录</div>
          <Button type='primary' onClick={::this.handleDirectoryNew}>+ 添加目录</Button>
        </div>
        <Table columns={directoryColumns} dataSource={data} pagination={pagination} />
        <Modal
          title={this.state.modalTitle}
          visible={this.state.showModal}
          onOk={::this.handleModalEnsure}
          onCancel={::this.handleModalCancel}
          okText='确定'
          cancelText='取消'>
          {this.renderForm()}
        </Modal>
      </div>
    );
  }

  // handle directory changes
  handleDirectoryNew() {
    const defaultFormData = {
      name_zh: undefined,
      name_map: undefined
    };
    const validateStatus = {
      name_zh: false,
      name_map: false
    };
    this.setState({
      showModal: true,
      modalTitle: '新建目录',
      formData: defaultFormData,
      validateStatus: validateStatus
    })
  }

  handleDirectoryEdit(record) {
    const defaultFormData = {
      name_zh: record.name_zh,
      name_map: record.name_map
    };
    const validateStatus = {
      name_zh: false,
      name_map: false
    };
    this.setState({
      showModal: true,
      modalTitle: '修改目录',
      formData: defaultFormData,
      validateStatus: validateStatus
    })
  }

  handleDirectoryDelete(id) {
    // 获取到字段的id
    console.log(id);
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
