import React from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Table,
  Modal,
  Form,
  Select,
  Input,
  notification
} from 'tapas-ui';

import * as actionsForMem from '#/actions/members';
import Avatar from '#/components/Avatar/Avatar';

import validate from '#/utils/validate';

import { userListColumns } from './table-columns';

import './style.less';

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
        role: 'member',
      },
      validateStatus: {
        email: false
      },
      currentField: undefined
    }
  }

  componentDidMount() {
    this.fetchMemberList()
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
          help='请输入正确邮箱'
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
      <Form horizontal onSubmit={e => e.preventDefault()}>
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
            <Option value='member'>普通用户</Option>
          </Select>
        </FormItem>
      </Form>
    );
  }

  render() {
    const { members, user } = this.props;
    const memberList = this.arrangeMembers(user, [].concat(members));
    const data = memberList.map( (item, index) => {
      const newItem = Object.assign({}, item);
      newItem.key = index;
      newItem.role = item.roles[0];
      newItem.permission = this.isAdminNotSelf(item.email);
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
      <div className='member'>
        <div className='heading'>
          <div className='title'>{`所有成员· ${this.props.members.length}`}</div>
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

  fetchMemberList() {
    this.props.dispatch(
      actionsForMem.index({})
    )
  }

  arrangeMembers(user, members) {
    // user in first
    const emailsArray = members.map(item => item.email);
    const position = emailsArray.indexOf(user.email);
    if (position > -1) {
      const userData = members[position];
      members.splice(position, 1)
      members.unshift(userData);
      return members;
    } else {
      return members;
    }
  }

  isAdminNotSelf(email) {
    const { members, user } = this.props;
    // can't config yourself role
    const isSelf = email === user.email;
    // when u are admin then u can config others' roles
    const emailsArray = members.map(item => item.email);
    const position = emailsArray.indexOf(user.email);
    let permission = false;
    if (position > -1) {
      const userData = members[position];
      const isAdmin = userData.roles.indexOf('admin') > -1;
      if (isAdmin && !isSelf) {
        permission = true;
      }
    }
    return permission;
  }

  handleMemberNew() {
    const defaultFormData = {
      email: undefined,
      role: 'member'
    };
    const validateStatus = {
      email: false
    };
    this.setState({
      showModal: true,
      modalTitle: '邀请成员',
      username: undefined,
      formData: defaultFormData,
      validateStatus: validateStatus,
      currentField: undefined
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
      validateStatus: validateStatus,
      currentField: record
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
    if (this.state.formData.email) {
      let { email, role } = this.state.formData;
      email = email.trim();
      if (this.validate('email', email)) {
        const { currentField } = this.state;
        if (currentField) {
          const { id, name } = currentField;
          this.props.dispatch(
            actionsForMem.update({
              id,
              role
            })
          ).then(res => {
            if (!res.err) {
              notification.success({
                message: '权限修改成功',
                description: `${name}已成为${role === 'admin' ? '管理员': '普通用户'}`
              });
              this.fetchMemberList();
              this.setState({
                showModal: false
              })
            }
          })
        } else {
          this.props.dispatch(
            actionsForMem.invite({
              email,
              role
            })
          ).then(res => {
            if (res.err && res.err.status === 404) {
              notification.error({
                message: '邮箱无效',
                description: `${email} 该邮箱未注册S-CMS`
              });
            } else {
              notification.success({
                message: '邀请成功',
                description: `${email}已加入企业`
              });
              this.fetchMemberList();
              this.setState({
                showModal: false
              });
            }
          })
        }
      } else {
        const newValidateStatus = Object.assign({}, this.state.validateStatus);
        newValidateStatus.email = true;
        this.setState({
          validateStatus: newValidateStatus
        });
      }
    }
  }

  handleModalCancel() {
    this.setState({
      showModal: false
    })
  }

  validate(item, itemValue) {
    const testObj = {
      name: item,
      value: itemValue.trim()
    };
    return validate(testObj);
  }
}

export default connect(state => ({
  members: state.members.data,
  user: state.user
}))(Member)
