import React from 'react';
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

import validate from '#/utils/validate';
import history from '#/utils/history';

const FormItem = Form.Item;

export default class AddMember extends React.Component {
  static defaultProps = {
    members: [
      { name: '刘雯雯', email: 'wynneliu@163.com' },
      { name: '夏娜', email: 'xiana@163.com' },
      { name: '晓明', email: 'xiaoming@163.com' },
      { name: '李莎', email: 'lisha@163.com' },
      { name: '刘雯雯', email: 'wynneliu@163.com' },
      { name: '夏娜', email: 'xiana@163.com' },
      { name: '晓明', email: 'xiaoming@163.com' },
      { name: '李莎', email: 'lisha@163.com' },
      { name: '刘雯雯', email: 'wynneliu@163.com' },
      { name: '夏娜', email: 'xiana@163.com' },
      { name: '夏娜', email: 'xiana@163.com' }
    ]
  };

  static propTypes = {
    members: React.PropTypes.array
  };

  constructor(props) {
    super(props);
    this.state = {
      email: undefined,
      currentPage: 1,
      totalPages: Math.ceil(this.props.members.length / 10)
    }
  }

  renderMemberList() {
    const { members } = this.props;
    const { currentPage } = this.state;
    const endIndex = currentPage * 10;
    const onePageMembers = members.slice(endIndex - 10, endIndex);
    return (
      <div className='members'>
        {
          onePageMembers.map( (item, index) => {
            const { name, email } = item;
            return (
              <div key={index} className='member'>
                <div className='avatar'>{name.substr(name.length - 1)}</div>
                <div className='name'>{name}</div>
                <div className='email'>{email}</div>
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

  handleInput(e) {
    this.setState({
      email: e.target.value
    });
  }

  handleEnter(e) {
    if (e.keyCode === 13) {
      if (this.validate('email', this.state.email)) {
        console.log('submit invite with', this.state.email.trim())
        notification.success({
          message: '邀请成功',
          description: `${this.state.email}已加入企业`
        });
        this.setState({
          email: undefined
        });
      } else {
        notification.error({
          message: '邮箱无效',
          description: `${this.state.email}该邮箱无效`
        });
      }
    }
  }

  handlePrevClcik() {
    const { currentPage } = this.state;
    let nextPage = currentPage - 1;
    if (nextPage < 1) {
      nextPage = 1;
    }
    this.setState({
      currentPage: nextPage
    });
  }

  handleNextClick() {
    const { currentPage, totalPages } = this.state;
    console.log(currentPage, totalPages)
    let nextPage = currentPage + 1;
    if (nextPage > totalPages) {
      nextPage = totalPages;
      // how to jump out of this ?
    }
    this.setState({
      currentPage: nextPage
    });
  }

  validate(item, itemValue) {
    const testObj = {
      name: item,
      value: itemValue.trim()
    };
    return validate(testObj);
  }
}
