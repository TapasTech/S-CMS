import React from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Table,
  Modal,
  Form,
  Select,
  Input
} from 'tapas-ui';

import * as actionsForMem from '#/actions/members';
import Avatar from '#/components/Avatar/Avatar';

import { userListColumns } from './table-columns';

const dataSource = [{
  id: '102',
  key: '1',
  name: '张三',
  role: 'admin',
  email: '11@qq.com',
  permission: true
}, {
  id: '103',
  key: '2',
  name: '张四',
  role: 'user',
  email: '12@qq.com',
  permission: true
}, {
  id: '104',
  key: '3',
  name: '张五',
  role: 'user',
  email: '13@qq.com',
  permission: false
}];

const FormItem = Form.Item;
const Option = Select.Option;

class Member extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      modalTitle: undefined,
      username: undefined,
      formData: {
        email: undefined,
        role: 'admin',
      },
      validateStatus: {
        email: false
      }
    }
  }

  handleMemberNew() {
    const defaultFormData = {
      email: undefined,
      role: 'admin'
    };
    const validateStatus = {
      email: false
    };
    this.setState({
      showModal: true,
      modalTitle: '邀请成员',
      username: undefined,
      formData: defaultFormData,
      validateStatus: validateStatus
    })
  }

  handleMemberEdit(record) {
    const defaultFormData = {
      email: record.email,
      role: record.role
    };
    const validateStatus = {
      name_zh: false,
      name_map: false
    };
    this.setState({
      showModal: true,
      modalTitle: '修改权限',
      username: record.name,
      formData: defaultFormData,
      validateStatus: validateStatus
    })
  }

  handleMemberDelete(id) {
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

  componentDidMount() {
    this.props.dispatch(actionsForMem.index({}))
  }

  renderUser() {
    const { username, formData } = this.state;
    const validateStatus = this.state.validateStatus;
    if (username) {
      return (
        <div className='user'>
          <Avatar name={username} email={formData.email} />
        </div>
      );
    } else {
       return(
        <FormItem
          hasFeedback
          validateStatus={validateStatus.email ? 'error' : ''}
          help='请输入邮箱'
          label='邮箱：'
          labelCol={{span: 6}}
          wrapperCol={{span: 14}}>
          <Input
            type='text'
            value={formData.email}
            onChange={this.handleFormChange.bind(this, 'email')}
            placeholder='输入被邀请人邮箱' />
        </FormItem>
      );
    }
  }

  renderForm() {
    const formData = this.state.formData;
    const validateStatus = this.state.validateStatus;
    return (
      <Form horizontal>
        {this.renderUser()}
        <FormItem
          label='用户权限：'
          labelCol={{span: 6}}
          wrapperCol={{span: 14}}>
          <Select
            style={{width:'100%'}}
            size='large'
            defaultValue={formData.role}
            value={formData.role}
            onChange={this.handleFormChange.bind(this, 'role')} >
            <Option value='admin'>管理员</Option>
            <Option value='user'>普通用户</Option>
          </Select>
        </FormItem>
      </Form>
    );
  }

  render() {
    const data = dataSource.map( (item, index) => {
      const newItem = Object.assign({}, item);
      newItem.key = index;
      newItem.onEdit = ::this.handleMemberEdit;
      newItem.onDelete = ::this.handleMemberDelete;
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
      <div className='member content'>
        <div className='heading'>
          <div className='title'>所有成员·15</div>
          <Button type='primary' onClick={::this.handleMemberNew}>+ 邀请成员</Button>
        </div>
        <Table columns={userListColumns} dataSource={data} pagination={pagination} />
        <Modal
          key='member'
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
  members: state.members.data
}))(Member)
