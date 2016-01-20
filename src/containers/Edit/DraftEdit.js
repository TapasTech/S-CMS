import React from 'react';
import {connect} from 'react-redux';
import {pushState} from 'redux-router';
import EditView from './Edit';

import * as actionsForDrafts from '#/actions/drafts';
import * as actionsForConfigs from '#/actions/configs';

class DraftEditView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }

  componentWillMount() {
    this.loadFields();
    this.loadData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.draft) {
      this.setState({data: nextProps.draft});
    }
    if (this.props.params.draftId != nextProps.params.draftId) {
      this.loadData(nextProps);
    }
    if (this.props.params.draftTypeId != nextProps.params.draftTypeId) {
      this.loadFields(nextProps);
    }
  }

  render() {
    const transitionToDrafts = ::this.transitionToDrafts;
    return (
      <EditView
        data={this.state.data}
        fields={this.props.fields}
        loading={this.state.loading}
        onSave={::this.doSave}
        onBeforePublish={::this.doSave}
        onPublish={::this.onPublish}
        onCancelled={transitionToDrafts}
        onSaved={transitionToDrafts}
        onPublished={transitionToDrafts}
        />
    );
  }

  loadFields(props) {
    props = props || this.props;
    const id = props.params.draftTypeId;
    id && props.dispatch(
      actionsForConfigs.drafts.show({id})
    );
  }

  loadData(props) {
    props = props || this.props;
    const data = {
      id: props.params.draftId,
    };
    if (data.id === 'new') data.id = '';
    if (!data.id) {
      props.dispatch(
        actionsForDrafts.clear()
      );
      this.setState({data, loading: false});
    } else {
      props.dispatch(
        actionsForDrafts.show({id: data.id})
      );
      this.setState({data, loading: true});
    }
  }

  doSave(data) {
    this.setState({loading: true});
    return this.props.dispatch(
      data.id
        ? actionsForDrafts.update(data)
        : actionsForDrafts.create(data)
    ).then(() => {
      this.setState({loading: false});
    });
  }

  onPublish(data, categoryIds) {
    this.setState({loading: true});
    return Promise.all(this.props.dispatch(
      categoryIds.map(categoryId => actionsForDrafts.publish({
        id: data.id,
        categoryId,
      }))
    ))
    .then(() => this.transitionToList());
  }

  transitionToDrafts() {
    const params = this.props.params;
    const pathname = `/${params.orgId}/${params.productId}/draft/${params.draftTypeId}`;
    this.props.dispatch(pushState(null, pathname));
  }
}

export default connect(state => ({
  draft: state.drafts.current,
  fields: state.configs.fields.data,
}))(DraftEditView);
