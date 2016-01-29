import React from 'react';
import {connect} from 'react-redux';
import {notification} from 'tapas-ui';
import {flux} from '#/reducers';
import EditView from './Edit';

import * as actionsForConfigs from '#/actions/configs';

class ArticleEditView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      data: {},
    };
  }

  componentWillMount() {
    this.loadData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.articleId !== nextProps.params.articleId) {
      this.loadData(nextProps);
    } else {
      if (this.props.article !== nextProps.article) {
        this.setState({
          data: nextProps.article,
          loadedData: true,
        });
        this.loadFields(nextProps);
      }
      if (nextProps.fields) {
        this.setState({
          loadedFields: true,
        });
      }
    }
  }

  render() {
    const transitionToList = ::this.transitionToList;
    return (
      <EditView
        data={this.state.data}
        fields={this.props.fields}
        loading={!this.state.loadedFields || !this.state.loadedData}
        onBeforePublish={::this.doSave}
        onPublish={::this.onPublish}
        onCancelled={transitionToList}
        onPublished={transitionToList}
        />
    );
  }

  doSave(_data) {
    notification.error({message: '暂不支持此操作！'});
    return Promise.reject();
  }

  onPublish(_data, _categoryIds) {
  }

  loadData(props) {
    this.setState({
      loadedData: false,
      loadedFields: false,
    });
    props = props || this.props;
    props.dispatch(flux.actionCreators.articles.retrieve(props.params.articleId));
  }

  loadFields(props) {
    const id = props.article.dynamicFieldConfig.id;
    id && props.dispatch(
      actionsForConfigs.drafts.show({id})
    );
  }

  transitionToList() {
  }
}

export default connect(state => ({
  article: state.articles_item.data,
  fields: state.configs.fields.data,
}))(ArticleEditView);
