import React from 'react';
import {Link} from 'react-router';
import {connect} from 'react-redux';
import {pushState} from 'redux-router';
import {Select, Table} from 'tapas-ui';
import {Restful, history} from '#/utils';
import style from './style.less';

import * as actionsForDrafts from '#/actions/drafts';

/*
Restful.config({
  headers: {
    'Http-Authorization': 'eyJ1c2VyX2lkIjoiNTY5NWVlNzA1ZTk4YmU2NWJhMDAwMDExIiwiZXhwaXJlc19hdCI6IjIwMTYtMDEtMjBUMTQ6MzE6MjcuMzk0KzA4OjAwIiwicGFzc3dvcmRfZGlnZXN0IjoiJDJhJDEwJGVEcFlQRGp5QVRIYjBqSEoyR1RXSS5KS1hwaDREQ0JRdUdZcTJneXYxODVQb2suUzFiZmJXIn0=--e1f0ab7c5423e13e6e3225cf3e67796a19af115f',
  },
});
*/

/*
const article = Restful
.collection('organizations').model('5695f0095e98be65ba000014')
.collection('products').model('5695f3df5e98be65ba000016')
.collection('categories').model('5695f4a35e98be65ba000019')
.collection('articles').model('5695f96c5e98be65ba000025');
*/

/*
const product = Restful
.collection('organizations').model('5695f0095e98be65ba000014')
.collection('products').model('5695f3df5e98be65ba000016');

product.collection('drafts').get().then(res => console.log(1, res));
product.collection('categories').get().then(res => console.log(2, res));
product.collection('dynamic_field_configs').get().then(res => console.log(3, res));
*/

/*
const user = Restful.collection('user');
user.post({
  user: {
    email: 'i@gerald.top',
    password: '12345678',
    name: 'Gerald',
  },
}).then((res) => {console.log(res);});
user.get().then((res) => {console.log(res);});
*/

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
    } else {
      console.log(this.props, nextProps);
      this.setState({loading: false});
    }
  }

  loadData() {
    this.props.dispatch([
      actionsForDrafts.index({}),
    ]);
    this.setState({loading: true});
  }

  handleChangeType(draftTypeId) {
    const params = this.props.params;
    let pathname = `/${params.orgId}/${params.productId}/draft`;
    if (draftTypeId) pathname += `/${draftTypeId}`;
    this.props.dispatch([
      pushState(null, pathname),
    ]);
  }

  getArticlePath(rec) {
    const params = this.props.params;
    const draftTypeId = params.draftTypeId;
    // TODO Get draftTypeId from rec
    if (!draftTypeId) return this.props.location.pathname;
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
      dataIndex: 'type',
      render: type => ({
        children: {
          columns: '栏目',
          live: '直播',
        }[type],
      }),
    }, {
      title: '标题',
      key: 'title',
      dataIndex: 'title',
      render: (text, rec) => (
        <Link to={this.getArticlePath(rec)}>{rec.dynamicFieldCollection.title}</Link>
      ),
    }, {
      title: '字数',
      key: 'text_size',
      dataIndex: 'text_size',
    }, {
      title: '修改时间',
      key: 'modified_time',
      dataIndex: 'modified_time',
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
