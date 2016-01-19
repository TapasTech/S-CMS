import React from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Table,
  Modal,
  Form,
  Input
} from 'tapas-ui';

import * as actionsForDistributions from '#/actions/distributions';

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

class ProductDirectory extends React.Component {
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
       validateStatus: validateStatus,
       currentDistribution: null
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
       validateStatus: validateStatus,
       currentDistribution: record
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
        this.props.dispatch(
          this.state.currentDistribution 
          ? actionsForDistributions.update({
            id: this.state.currentDistribution.id,
            displayName: formData.name_zh,
            mappingName: formData.name_map
          })
          : actionsForDistributions.create({
            displayName: formData.name_zh,
            mappingName: formData.name_map
          })
        )
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

   componentDidMount() {
     this.props.dispatch(actionsForDistributions.index({}));
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
    const data = this.props.distributions.map( (item, index) => ({
      id: item.id,
      key: item.id,
      name_zh: item.displayName,
      name_map: item.mappingName,
      editable: true,
      onEdit: ::this.handleDirectoryEdit,
      onDelete: ::this.handleDirectoryDelete,
    }));

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

}

export default connect(state => ({
  distributions: state.distributions.data
}))(ProductDirectory);
