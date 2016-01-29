import React from 'react';
import { connect } from 'react-redux';
import { Menu, Icon, Form, Input, Button } from 'tapas-ui';
import { Link } from 'react-router';

import * as actionsForOrgs from '#/actions/organizations';

import {Header} from '#/components';

import './style.less';

const FormItem = Form.Item;

export class Jumbotron extends React.Component {
  render() {
    const {name, desc} = this.props;
    return (
      <div className='jumbotron'>
        <div className='notice'>
          <div className='name'>{name}</div>
          <div className='desc'>{desc}</div>
        </div>
      </div>
    );
  }
}

export class Navigator extends React.Component {
  constructor() {
    super();
    this.state = {
      items: [
        {key: 'product', name: '产品端配置'},
        {key: 'organization', name: '企业设置'},
        {key: 'member', name: '成员管理'}
      ]
    };
    this._refs = {};
  }
  render() {
    const paddingLeft = (window.innerWidth - 960) * 0.5;
    const padding = `0 ${paddingLeft}px`;
    const {current, handleClick, orgId} = this.props;
    return (
      <Menu
        ref="menu"
        style={{padding: padding, fontSize: 14}}
        mode='horizontal'
        selectedKeys={[current]}
        onClick={handleClick}>
        {
          this.state.items.map(item => {
            const {key, name} = item;
            const href = `/${orgId}/settings/${key}`;
            return (
              <Menu.Item key={key}
                ref={item => this._refs[key] = item}
                >
                <Link to={href} data-href={href}>{name}</Link>
              </Menu.Item>
            );
          })
        }
      </Menu>
    );
  }
}

class SettingContainer extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      current: `${this.handleCurrent()}`
    }
  }

  componentDidMount() {
    const orgId = this.props.params.orgId;
    this.props.dispatch(actionsForOrgs.show({id: orgId}));
  }

  handleCurrent() {
    const { route, routes } = this.props;
    const routesArray = routes.map(item => item.path);
    const position = routesArray.indexOf(route.path);
    return routesArray[position + 1];
  }

  handleNavClick(item) {
    this.setState({
      current: item.key
    });
  }

  render() {
    const org = this.props.org;
    return (
      <div className='settings' style={{height: window.innerHeight}}>
        <Header />
        <Jumbotron name={org ? org.name : ''} desc={org ? org.description : ''} />
        <Navigator
          orgId={this.props.params.orgId}
          current={this.state.current}
          handleClick={::this.handleNavClick} />
        {this.props.children}
      </div>
    )
  }
}

exports.SettingContainer = connect(state => ({
  org: state.organizations.datum,
  user: state.user
}), undefined, undefined, {withRef: true})(SettingContainer);
