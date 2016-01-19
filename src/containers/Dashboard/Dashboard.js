import React from 'react';
import { connect } from 'react-redux';

import * as actionsForPros from '#/actions/productions';
import * as actionsForUser from '#/actions/user';

import Header from '#/components/Header/Header';
import Avatar from '#/components/Avatar/Avatar';
import BoxList from '#/components/BoxList/BoxList';
import history from '#/utils/history';

import './style.less';

class Dashboard extends React.Component {

  static propTypes = {
    orgs: React.PropTypes.array
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.dispatch([
      actionsForPros.all(),
      actionsForUser.show()
    ])
  }

  renderUser() {
    return (
      <div className='user'>
        <div className='avatar'>{this.props.user.name}</div>
        <div className='desc'>
          <div className='username'>{this.props.user.name}</div>
          <div className='tip'>你好，欢迎登录 S-CMS</div>
        </div>
      </div>
    );
  }

  renderOrg(item, index) {
    let itemSource;
    if (item.id) {
      itemSource = item.list.map( product => {
        return {
          title: product.name,
          desc: product.description,
          handleClick: () => history.pushState(null, `/${item.id}/${product.id}/library`)
        }
      })
      itemSource.push({
        title: '管理员配置',
        desc: '管理员在此管理配置各子应用',
        handleClick: () => history.pushState(null, `/${item.id}/settings/product`)
      });
    } else {
      itemSource = item.list;
    }
    return (
      <div className='org' key={index}>
        <div className='name' onClick={item.handleClick}>{item.name}</div>
        { itemSource.length ? <BoxList viewer={3} list={itemSource} /> : undefined }
      </div>
    );
  }

  render() {
    let orgSource = Array.prototype.concat.apply([], this.props.orgs);
    orgSource.push({
      name: '+ 创建组织',
      list: [],
      handleClick: () => history.pushState(null, '/create')
    })

    return (
      <div className='dashboard-container'>
        <Header title='S-CMS'>
          <Avatar />
        </Header>
        <div className='dashboard'>
          {this.renderUser()}
          {
            orgSource.map((item, index) => {
              return this.renderOrg(item, index)
            })
          }
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  orgs: state.productions.data,
  user: state.user
}))(Dashboard);
