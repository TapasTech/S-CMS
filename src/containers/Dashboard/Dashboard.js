import React from 'react';
import { connect } from 'react-redux';

import * as actionsForPros from '#/actions/productions';

import Header from '#/components/Header/Header';
import BoxList from '#/components/BoxList/BoxList';

import './style.less';

class Dashboard extends React.Component {

  static defaultProps = {
    orgs: [
      {
        name: '',
        list: [
          {title: '用户管理中心', desc: '管理和查看全平台注册用户来源、统计和明细'},
          {title: '管理员配置', desc: '管理员在此管理配置各子应用'}
        ]
      },
      {
        name: 'Tapas Tech',
        list: [
          {title: '用户管理中心', desc: '管理和查看全平台注册用户来源、统计和明细'},
          {title: '管理员配置', desc: '管理员在此管理配置各子应用'}
        ]
      }
    ]
  };

  static propTypes = {
    orgs: React.PropTypes.array
  };

  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.dispatch(actionsForPros.all());
  }

  renderUser() {
    return (
      <div className='user'>
        <div className='avatar'>雯雯</div>
        <div className='desc'>
          <div className='username'>刘雯雯</div>
          <div className='tip'>你好，欢迎登录 S-CMS</div>
        </div>
      </div>
    );
  }

  renderOrg({name, list}, index) {
    return (
      <div className='org' key={index}>
        <div className='name'>{name}</div>
        <BoxList viewer={3} list={list} />
      </div>
    );
  }


  render() {
    return (
      <div className='dashboard-container'>
        <Header title='S-CMS' />
        <div className='dashboard'>
          {this.renderUser()}
          {
            this.props.orgs.map((item, index) => {
              return this.renderOrg(item, index)
            })
          }
        </div>
      </div>
    );
  }
}

export default connect(state => ({
  orgs: state.productions.data
}))(Dashboard);
