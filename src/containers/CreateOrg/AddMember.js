import React from 'react';
import { connect } from 'react-redux';
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Icon,
  Pagination,
  notification
} from 'tapas-ui';

import * as actionsForMem from '#/actions/members';

import Avatar from '#/components/Avatar/Avatar';

import validate from '#/utils/validate';
import history from '#/utils/history';

const FormItem = Form.Item;

class AddMember extends React.Component {

  static propTypes = {
    members: React.PropTypes.array
  };

  constructor(props) {
    super(props);
    const { members } = this.props;
    this.state = {
      email: undefined,
      currentPage: 1,
      totalPages: Math.ceil([].concat(members).length / 10)
    }
  }

  componentDidMount() {
    const { orgId } = this.props;
    orgId && this.fetchMemberList();
  }

  renderMemberList() {
    const { user, members } = this.props;
    const memberList = this.arrangeMembers(user, [].concat(members));
    const { currentPage } = this.state;
    const endIndex = currentPage * 10;
    let onePageMembers = memberList.slice(endIndex - 10, endIndex);
    return (
      <div className='members'>
        {
          memberList[0]
          && onePageMembers.map( (item, index) => {
            const { name, email } = item;
            return (
              <div key={index} className='member'>
                <Avatar name={name} email={email} showEmail={true} />
              </div>
            );
          })
        }
      </div>
    );
  }

  renderPagintaion() {
    const { currentPage, totalPages } = this.state;
    var leftClass, rightClass;
    if (currentPage === 1) {
      leftClass = 'pager disabled';
      rightClass = 'pager';
    } else if (currentPage === totalPages) {
      leftClass = 'pager';
      rightClass = 'pager disabled';
    } else {
      leftClass = 'pager';
      rightClass = 'pager';
    }
    return (
      <div className='pagination'>
        <div className={leftClass} onClick={::this.handlePrevClcik}>
          <Icon type='left' />
        </div>
        <div className={rightClass} onClick={::this.handleNextClick}>
          <Icon type='right' />
        </div>
      </div>
    );
  }

  render() {
    return (
      <div className='add-member'>
        <div className='invite-input'>
          <label>新成员邮箱：</label>
          <input
            type='text'
            value={this.state.email}
            onChange={::this.handleInput}
            onKeyDown={::this.handleEnter}
            placeholder='输入邮箱，回车添加' />
        </div>
        <div className='member-list'>
          {this.renderMemberList()}
          {(this.state.totalPages > 1) && this.renderPagintaion()}
        </div>
        <Button
          style={{width: 150, marginTop: 15}}
          type='primary'
          size='large'
          onClick={() => history.pushState(null, '/dashboard')}>
          完成，进入企业
        </Button>
      </div>
    );
  }

  fetchMemberList() {
    this.props.dispatch(
      actionsForMem.index({orgId: this.props.orgId}),
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

  handleInput(e) {
    this.setState({
      email: e.target.value
    });
  }

  handleEnter(e) {
    if (e.keyCode === 13 && this.state.email) {
      const email = this.state.email.trim();
      if (this.validate('email', email)) {
        const { orgId } = this.props;
        this.props.dispatch(
          actionsForMem.invite({
            orgId: orgId,
            email: email
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
              description: `${this.state.email}已加入企业`
            });
            orgId && this.fetchMemberList();
          }
          this.setState({
            email: undefined
          });
        })
      } else {
        notification.error({
          message: '邮箱无效',
          description: '请输入正确的邮箱'
        });
      }
    }
  }

  handlePrevClcik() {
    const { currentPage } = this.state;
    const nextPage = currentPage - 1;
    if (nextPage >= 1) {
      this.setState({
        currentPage: nextPage
      });
    }
  }

  handleNextClick() {
    const { currentPage, totalPages } = this.state;
    const nextPage = currentPage + 1;
    if (nextPage <= totalPages) {
      this.setState({
        currentPage: nextPage
      });
    }
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
}))(AddMember)
