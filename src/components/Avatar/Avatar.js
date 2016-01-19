import React from 'react';
import { connect } from 'react-redux';

import * as actionsForUser from '#/actions/user';

import './style.less';

class Avatar extends React.Component {

  static propTypes = {
    showRole: React.PropTypes.bool,
    showEmail: React.PropTypes.bool,
    name: React.PropTypes.string,
    role: React.PropTypes.string,
    email: React.PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.dispatch(
      actionsForUser.show()
    )
  }

  render() {
    const { user, showRole, showEmail } = this.props;
    const name = this.props.name || this.props.user.name;
    const email = this.props.email || this.props.user.email;
    const role = this.props.role || this.props.user.role;
    return (
      <div className='avatar-container'>
        <div className='avatar'>{name.substr(name.length - 1)}</div>
        <div className='desc'>
          <div className='name'>{name}</div>
          { showRole && role && <div className='role'>{role === 'admin' ? '管理员' : '普通用户'}</div> }
        </div>
        { showEmail && <div className='email'>{email}</div> }
      </div>
    );
  }
}

export default connect(state => ({
  user: state.user
}))(Avatar)
