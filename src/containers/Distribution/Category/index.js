import React from 'react';
import LibraryFilter from '#/components/LibraryFilter';
import {
  Table,
  Menu,
  Dropdown,
  Icon
} from 'tapas-ui';
import {
  connect
} from 'react-redux';
import {flux} from '#/reducers';
import {query} from '#/utils/params';
import moment from 'moment';
import styles from './style.less';
import { pushState } from 'redux-router';
import ArticleView from './ArticleView';
import {fetch} from '#/utils/restful';

class Category extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentWillMount() {
    this.props.dispatch(flux.actionCreators.articles.list(query()));
    this.url = location.href;
  }
  componentWillUpdate(nextProps, nextState) {
    if(location.href !== this.url) {
      this.url = location.href;
      this.props.dispatch(flux.actionCreators.articles.list(query()));
    }
  }
  render() {
    const columns = [
      {
        title: '稿件类型',
        dataIndex: 'type',
        key: 'type'
      },
      {
        title: '标题',
        dataIndex: 'title',
        key: 'title',
        render: (text, record, index) => <a onClick={() => this.setState({article: record.key, showArticle: true})}>{text}</a>
      },
      {
        title: '字数',
        dataIndex: 'count',
        key: 'count'
      },
      {
        title: '作者',
        dataIndex: 'author',
        key: 'author'
      },
      {
        title: '发布时间',
        dataIndex: 'publishAt',
        key: 'publishAt'
      },
      {
        title: '发布渠道',
        dataIndex: 'channel',
        key: 'channel'
      },
      {
        title: '操作',
        dataIndex: 'operation',
        key: 'operation',
        render: (text, record, value) => {
          const params = this.props.params;
          const handlePublish = () => {
            return fetch(`organizations/${params.orgId}/products/${params.productId}/categories/${params.categoryId}/articles/${record.key}/_publish`)
            .post().then(res => this.props.dispatch(flux.actionCreators.articles.list(query())));
          }
          const handleUnpublish = () => {
            return fetch(`organizations/${params.orgId}/products/${params.productId}/categories/${params.categoryId}/articles/${record.key}/_unpublish`)
            .post().then(res => this.props.dispatch(flux.actionCreators.articles.list(query())));
          }
          const menu =
          <Menu>
            <Menu.Item key="0">
              <a onClick={() => this.props.dispatch(pushState(null, `/${params.orgId}/${params.productId}/distribution/${params.categoryId}/${record.key}/edit`))}>修改</a>
            </Menu.Item>
            <Menu.Item key="1">
              {record.status === 'unpublished'
                ?
                <a onClick={handlePublish}>上线</a>
                :
                <a onClick={handleUnpublish}>下线</a>
              }
            </Menu.Item>
          </Menu>
          return (
            <Dropdown overlay={menu} trigger={['click']}>
              <a className="ant-dropdown-link" >
                管理 <Icon type="down" />
              </a>
            </Dropdown>
          )
        }
      }
    ];

    const data = this.props.articles.data
    ?
    this.props.articles.data.map(article => {
      return {
        key: article.id,
        type: article.dynamicFieldCollection.type || '没有字段',
        title: article.dynamicFieldCollection.title || '没有字段',
        count: article.dynamicFieldCollection.count ||'没有字段',
        author: article.dynamicFieldCollection.author ||'没有字段',
        publishAt: moment(article.publishAt).format('MM/DD HH:mm') || '没有字段',
        channel: article.dynamicFieldCollection.channel || '没有字段',
        operation: article.dynamicFieldCollection.operation || '没有字段',
        status: article.status
      }
    })
    :
    [];

    return (
      <div className={styles.root}>
        <LibraryFilter time type column />
        <Table loading={this.props.articles['@status'] === 'pending'} columns={columns} dataSource={data}/>
        {
          this.state.article &&
          <div>
            <div className={this.state.showArticle ? "animated fadeIn shadow" : "animated fadeOut shadow"}>
            </div>
            <div className={this.state.showArticle ? "animated bounceInRight mask" : "animated bounceOutRight mask"}>
              <div className="back" onClick={()=>this.setState({...this.state, showArticle: false})}>
              </div>
              <div className="article-container">
                <ArticleView id={this.state.article}/>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}


export default connect(state => ({articles: state.articles_collection}))(Category);
