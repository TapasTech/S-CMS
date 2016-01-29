import React from 'react';
import {connect} from 'react-redux';
import {Modal, Checkbox} from 'tapas-ui';
import style from './style.less';

class Categories extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: !props.distributions,
    };
    this.getDistributions(props);
  }

  componentWillUpdate(nextProps, _nextState) {
    if (this.props.distributions !== nextProps.distributions) {
      this.getDistributions(nextProps);
      this.setState({loading: false});
    }
    if (this.props.visible !== nextProps.visible) {
      this.distributions.forEach(distribution => {distribution.checked = false;});
    }
  }

  getDistributions(props) {
    this.distributions = (props.distributions || []).map(distribution => ({
      ...distribution,
    }));
  }

  render() {
    return (
      <Modal title="发布"
        visible={!!this.props.visible}
        onOk={::this.handleOk}
        onCancel={::this.handleCancel}
        confirmLoading={this.state.loading}>
        {this.listDistributions()}
      </Modal>
    );
  }

  checkDistribution(distribution, e) {
    distribution.checked = e.target.checked;
    // XXX
    this.setState({});
  }

  listDistributions() {
    return this.distributions.map(distribution => (
      <label className={style.distribution}
        key={distribution.id}
        title={distribution.description}>
        <Checkbox checked={distribution.checked}
          onChange={this.checkDistribution.bind(this, distribution)} />
        {distribution.displayName}
      </label>
    ));
  }

  handleOk() {
    const categories = this.distributions
    .filter(distribution => distribution.checked)
    .map(distribution => distribution.id);
    this.setState({loading: true});
    Promise.resolve(
      categories.length && this.props.handleOk && this.props.handleOk(categories)
    ).then(() => this.setState({loading: false}));
  }

  handleCancel() {
    this.setState({loading: true});
    Promise.resolve(
      this.props.handleCancel && this.props.handleCancel()
    ).then(() => this.setState({loading: false}));
  }
}

export default connect(state => ({
  distributions: state.distributions.data,
}))(Categories);
