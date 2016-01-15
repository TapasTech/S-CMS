import React from 'react';
import {Select, Table} from 'tapas-ui';
import history from '#/utils/history';

export default class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      pagination: {
        //pageSize: 20,
      },
      data: [],
      query: {
        type: this.props.location.query.type || '',
      },
    };
    {
      this.data = [];
      for (let i = 0; i < 100; i ++) this.data.push({
        id: i,
        type: Math.random() < .5 ? 'columns' : 'live',
        title: `Title of draft-${i}`,
        text_size: 222,
        modified_time: Math.random() < .5 ? 'yesterday' : 'today',
      });
    }
  }

  handleChange(key, value) {
    const query = this.state.query;
    query[key] = value;
    this.props.history.push({
      pathname: this.props.location.pathname,
      query: query,
    });
    this.setState({
      loading: true,
      query: query,
    });
    console.log(`Selected: ${value}`);
  }

  handleJump(e) {
    e.preventDefault();
    this.props.history.push(e.target.dataset.path);
  }

  loadData() {
    const type = this.state.query.type;
    setTimeout(() => {
      this.setState({
        loading: false,
        data: this.data.filter((item) => !type || item.type === type),
      });
    }, 1000);
  }

  shouldComponentUpdate(nextProps, nextState) {
    return this.state.loading !== nextState.loading;
  }

  componentDidMount() {
    console.log('mounted');
    this.loadData();
  }

  componentDidUpdate() {
    console.log('updated');
    this.loadData();
  }

  render() {
    const types = [
      {title: '全部稿件类型', value: ''},
      {title: '栏目稿件', value: 'columns'},
      {title: '直播稿件', value: 'live'},
    ];
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
      render: (text, rec) => {
        const path = `${this.props.location.pathname}/${rec.type}/${rec.id}`;
        const href = this.props.history.createHref(path);
        return <a href={href} data-path={path} onClick={::this.handleJump}>{rec.title}</a>;
      },
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
      <div>
        <Select defaultValue={this.state.query.type} onChange={this.handleChange.bind(this, 'type')}>
          {types.map((item) => <Option key={item.value} value={item.value}>{item.title}</Option>)}
        </Select>
        <Table
          loading={this.state.loading}
          pagination={this.state.pagination}
          columns={columns}
          dataSource={this.state.data}
          rowKey={rec => rec.id}
        />
      </div>
    );
  }
};
