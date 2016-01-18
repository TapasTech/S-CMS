import React from 'react';
import { connect } from 'react-redux';

import * as actionsForPros from '#/actions/productions';

import Header from '#/components/Header/Header';
import Avatar from '#/components/Avatar/Avatar';
import BoxList from '#/components/BoxList/BoxList';
import history from '#/utils/history';

import { connect } from 'react-redux';
import { index } from '#/actions/organizations';

import './style.less';

class Dashboard extends React.Component {

  static defaultProps = {
    orgs: [
      {
        name: '第一财经新媒体科技有限公司',
        id: '1234',
        list: [
          {title: '产品端A', desc: 'Tapas 投研资讯部门的稿件生产协作平台', id: '11'},
          {title: '产品端B', desc: 'Tapas DT财经采编部门的稿件生产、运营平台', id: '12'},
          {title: '产品端C', desc: 'Tapas DT财经采编部门的稿件生产、运营平台', id: '13'},
          {title: '产品端D', desc: 'Tapas 投研资讯部门的稿件生产协作平台', id: '14'}
        ]
      },
      {
        name: 'Tapas Tech',
        id: '1222',
        list: []
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
        <div className='pic'>雯雯</div>
        <div className='desc'>
          <div className='username'>刘雯雯</div>
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
          title: product.title,
          desc: product.desc,
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

  componentDidMount() {
    this.props.dispatch(index());
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
          <Avatar name='刘雯雯' />
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
  orgs: state.productions.data
}))(Dashboard);
