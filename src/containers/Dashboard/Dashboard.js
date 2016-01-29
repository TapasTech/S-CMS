import React from 'react';
import { connect } from 'react-redux';
import { Spin } from 'tapas-ui';

import * as actionsForPros from '#/actions/productions';
import * as actionsForOrgs from '#/actions/organizations';
import * as actionsForUser from '#/actions/user';
import * as actionsForMem from '#/actions/members';

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
    this.state = {
      isAdmin: {}
    };
  }

  componentDidMount() {
    this.props.dispatch(actionsForPros.all());
    Promise.all([
      this.props.dispatch(actionsForUser.show()),
      this.props.dispatch(actionsForOrgs.index())
    ]).then(res => {
      const user = res[0];
      const orgs = res[1];
      let newIsAdmin = Object.assign({}, this.state.isAdmin);
      Promise.all(
        orgs.map(org => {
          const orgId = org.id;
          return this.props.dispatch(
            actionsForMem.index({orgId})
          ).then(members => {
            const idArray = members.map(mem => mem.id);
            const position = idArray.indexOf(user.id);
            if (position > -1) {
              if (members[position].roles[0] === 'admin') {
                newIsAdmin[orgId] = true;
              } else {
                newIsAdmin[orgId] = false;
              }
            }
          });
        })
      )
      .then(() => {
        this.setState({
          isAdmin: newIsAdmin
        });
      });
    });
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
    if (item.list) {
      itemSource = item.list.map( product => {
        return {
          title: product.name,
          desc: product.description,
          handleClick: () => history.pushState(null, `/${item.id}/${product.id}/library/external`)
        };
      });
      this.state.isAdmin[`${item.id}`]
        && itemSource.push({
          title: '管理员配置',
          desc: '管理员在此管理配置各子应用',
          handleClick: () => history.pushState(null, `/${item.id}/settings/product`)
        });
    } else {
      itemSource = item.list;
    }

    let productList = undefined;
    if (itemSource) {
      if (itemSource[0]) {
        productList = <BoxList viewer={3} list={itemSource} />;
      } else {
        productList = <div className='empty-product'>暂无项目</div>;
      }
    }

    return (
      <div className='org' key={index}>
        <div className='name'>
          <span className={!itemSource && 'create-btn'} onClick={item.handleClick}>{item.name}</span>
        </div>
        { productList }
      </div>
    );
  }

  render() {
    let orgSource = [].concat(this.props.productions);
    orgSource.push({
      name: '+ 创建组织',
      list: undefined,
      handleClick: () => history.pushState(null, '/create')
    });

    return (
      <div className='dashboard-container'>
        <Header />
        <div className='dashboard'>
          {this.renderUser()}
          {
            this.props.productions
            ? orgSource.map((item, index) => {
              return this.renderOrg(item, index);
            })
            : <div className='loading'>
                <Spin size='large' />
              </div>
          }
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  productions: state.productions.dataAll,
  user: state.user
}))(Dashboard);
