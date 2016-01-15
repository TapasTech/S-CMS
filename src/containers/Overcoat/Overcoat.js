import React from 'react';
import { connect } from 'react-redux';
import style from './style.less';

import Navigator from './Navigator';

import { hello } from '#/actions/welcome';

// *** Fixed me when `tapas-build` support `decorator`.
// @connect(state => ({
//   welcome: state.welcome
// }))
class Overcoat extends React.Component {
  componentDidMount() {
    this.props.dispatch(hello(this.props.location.pathname))
  }
  render() {
    return (
      <div className={style.container}>
        <div className={style.left}>
          <header>S-CMS</header>
          <Navigator {...this.props} />
        </div>
        <div className={style.right}>
          <header>
            sss
          </header>
          { this.props.children }
        </div>
      </div>
    )
  }
}

export default connect(state => ({welcome: state.welcome}))(Overcoat)