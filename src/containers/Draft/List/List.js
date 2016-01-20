import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {pushState} from 'redux-router';
import {Select, Table} from 'tapas-ui';
import {Restful, history} from '#/utils';
import style from './style.less';

import * as actionsForDrafts from '#/actions/drafts';

class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.params.draftTypeId != nextProps.params.draftTypeId) {
      this.loadData();
    }
  }

  loadData() {
    this.setState({loading: true});
    this.props.dispatch(
      actionsForDrafts.index({})
    ).then(() => {
      this.setState({loading: false});
    });
  }

  handleChangeType(draftTypeId) {
    const params = this.props.params;
    let pathname = `/${params.orgId}/${params.productId}/draft`;
    if (draftTypeId) pathname += `/${draftTypeId}`;
    this.props.dispatch(
      pushState(null, pathname)
    );
  }

  getArticlePath(rec) {
    const params = this.props.params;
    const draftTypeId = rec.dynamicFieldConfig.id;
    return `/${params.orgId}/${params.productId}/draft/${draftTypeId}/${rec.id}`;
  }

  render() {
    const draftTypeId = this.props.params.draftTypeId || '';
    const draftTypes = [
      {id: '', name: '全部稿件类型'},
      ...this.props.draftTypes
    ].map(item => (
      <Option key={item.id} value={item.id}>{item.name}</Option>
    ));
    const columns = [{
      title: '稿件类型',
      key: 'type',
      width: 120,
      render: (_, rec) => ({children: rec.dynamicFieldConfig.name}),
    }, {
      title: '标题',
      key: 'title',
      render: (_, rec) => (
        <Link to={this.getArticlePath(rec)}>{rec.dynamicFieldCollection.title || '空'}</Link>
      ),
    }];
    return (
      <div className={style.container}>
        <div className={style.selectors}>
          <Select
            value={this.state.loading ? '' : draftTypeId}
            onChange={::this.handleChangeType}>
            {draftTypes}
          </Select>
        </div>
        <Table
          loading={this.state.loading}
          pagination={false}
          columns={columns}
          dataSource={this.props.drafts.data}
          rowKey={rec => rec.id}
        />
      </div>
    );
  }
};

export default connect(state => ({
  draftTypes: state.configs.drafts.data,
  drafts: state.drafts,
}))(List);
