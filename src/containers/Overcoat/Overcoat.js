import React from 'react';
import { connect } from 'react-redux';
import { Input } from 'tapas-ui';
import { Link } from 'react-router';
import style from './style.less';

import Navigator from './Navigator';

import * as actionsForConfigs from '#/actions/configs';
import * as actionsForDistributions from '#/actions/distributions';

// *** Fixed me when `tapas-build` support `decorator`.
// @connect(state => ({
//   welcome: state.welcome
// }))
class Overcoat extends React.Component {
  componentDidMount() {
    this.props.dispatch([
      actionsForConfigs.drafts.index({}),
      actionsForDistributions.index({})
    ]);
  }
  render() {
    return (
      <div className={style.container}>
        <div className={style.left}>
          <header>S-CMS</header>
          <Navigator key={this.props.welcome} {...this.props} />
        </div>
        <div className={style.right}>
          <header>
            <div>
              { this.props.user.name }
            </div>
          </header>
          { this.props.children }
        </div>
      </div>
    )
  }
}

export default connect(state => ({
  drafts: state.configs.drafts.data,
  distributions: state.distributions.data,
  user: state.user
}))(Overcoat);
