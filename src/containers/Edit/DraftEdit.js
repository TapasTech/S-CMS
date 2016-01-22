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
    if (this.props.params.draftId != nextProps.params.draftId) {
      this.loadData(nextProps);
    } else if (nextProps.draft) {
      this.setState({
        data: nextProps.draft,
        loadedData: true,
      });
    }
    if (this.props.params.draftTypeId != nextProps.params.draftTypeId) {
      this.loadFields(nextProps);
    } else if (nextProps.fields) {
      this.setState({
        loadedFields: true,
      });
    }
  }

  render() {
    const transitionToDrafts = ::this.transitionToDrafts;
    return (
      <EditView
        data={this.state.data}
        fields={this.props.fields}
        loading={!this.state.loadedFields || !this.state.loadedData}
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
    this.setState({loadedFields: false});
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
      this.setState({data, loadedData: true});
      props.dispatch(
        actionsForDrafts.clear()
      );
    } else {
      this.setState({data, loadedData: false});
      props.dispatch(
        actionsForDrafts.show({id: data.id})
      );
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
    .then(() => this.setState({loading: false}));
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
