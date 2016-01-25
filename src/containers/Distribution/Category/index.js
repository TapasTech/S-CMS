import React from 'react';
import LibraryFilter from './LibraryFilter';
import {
  Table,
  Menu,
  Dropdown,
  Icon,
  Button,
  Popover
} from 'tapas-ui';
import {
  connect
} from 'react-redux';
import {flux} from '#/reducers';
import {query, path} from '#/utils/params';
import moment from 'moment';
import styles from './style.less';
import { pushState } from 'redux-router';
import ArticleView from './ArticleView';
import {fetch} from '#/utils/restful';

class Category extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pagination: {
        pageSize: 25,
        current: Number(query('page')) || 1,
        total: props.articles.meta && props.articles.meta.totalCount || 0
      }
    };
  }

  componentWillMount() {
    this.props.dispatch(flux.actionCreators.articles.list(query()));
    this.url = location.href;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...this.state,
      pagination: {
        ...this.state.pagination,
        current: Number(query('page')) || 1,
        total: nextProps.articles.meta && nextProps.articles.meta.totalCount || 0
      }
    })
  }

  componentDidUpdate() {
    if(location.href !== this.url) {
      this.url = location.href;
      this.props.dispatch(flux.actionCreators.articles.list(query()));
    }
  }

  publishArticle(articleId) {
    const params = this.props.params;
    this.setState({
      ...this.state,
      [articleId]: 'publishing'
    });
    return fetch(`organizations/${params.orgId}/products/${params.productId}/categories/${params.categoryId}/articles/${articleId}/_publish`)
    .post()
    .then(res => {
      this.setState({
        ...this.state,
        [articleId]: 'finished'
      })
      return this.props.dispatch(flux.actionCreators.articles.list(query()));
    });
  }

  unpublishArticle(articleId) {
    const params = this.props.params;
    this.setState({
      ...this.state,
      [articleId]: 'unpublishing'
    });
    return fetch(`organizations/${params.orgId}/products/${params.productId}/categories/${params.categoryId}/articles/${articleId}/_unpublish`)
    .post()
    .then(res => {
      this.setState({
        ...this.state,
        [articleId]: 'finished'
      });
      return this.props.dispatch(flux.actionCreators.articles.list(query()));
    });
  }

  toEditArticle(articleId) {
    const params = this.props.params;
    this.props.dispatch(pushState(null, `/${params.orgId}/${params.productId}/distribution/${params.categoryId}/${articleId}/edit`));
  }

  render() {
    const params = this.props.params;
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
        render: (text, record, index) => <a onClick={() => this.setState({
          articlePicked: {
            articleId: record.key
          },
          showArticle: true
        })}>{text}</a>
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
          const menu =
          <div>
            <Button size="small" onClick={this.toEditArticle.bind(this, record.key)}>修改</Button>
            {
              record.status === 'unpublished'
              ?
              <Button size="small" onClick={this.publishArticle.bind(this, record.key)} loading={this.state[record.key] === 'publishing'}>上线</Button>
              :
              <Button size="small" onClick={this.unpublishArticle.bind(this, record.key)} loading={this.state[record.key] === 'unpublishing'}>下线</Button>
            }
          </div>;

          return (
            <Popover placement="rightTop" overlay={menu} trigger="click">
              <Button>管理<Icon type="down" /></Button>
            </Popover>
          )
        }
      }
    ];

    const data = this.props.articles.data
    ?
    this.props.articles.data.map(article => {
      return {
        key: article.id,
        type: article.dynamicFieldConfig.name,
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

    const onChange = event => {
      this.addQuery({page: event.current});
      this.setState({
        ...this.setState,
        pagination: {
          ...this.state.pagination,
          current: Number(event.current)
        }
      });
    }

    const categoryName = this.props.categories.length && this.props.categories.find(category => category.id === path('categoryId')).displayName || '';
    return (
      <div className={styles.root}>
        <h1><b>{categoryName}</b> 分发至{categoryName}的稿件</h1>
        <div className={styles['main-container']}>
          <h2>稿件列表</h2>
          <hr/>
          <div className="table-container">
            <LibraryFilter timeFilter dynamicFieldConfigFilter/>
            <Table loading={this.props.articles['@status'] === 'pending'} columns={columns} dataSource={data} pagination={this.state.pagination} onChange={onChange}/>
          </div>
        </div>
        {
          this.state.articlePicked &&
          <div>
            <div className={this.state.showArticle ? "animated fadeIn shadow" : "animated fadeOut shadow"}>
            </div>
            <div className={this.state.showArticle ? "animated bounceInRight mask" : "animated bounceOutRight mask"}>
              <div className="back" onClick={()=>this.setState({...this.state, showArticle: false})}>
              </div>
              <div className="article-container">
                <ArticleView articleId={this.state.articlePicked.articleId} orgId={params.orgId} productId={params.productId} categoryId={params.categoryId}/>
              </div>
            </div>
          </div>
        }
      </div>
    )
  }
}


export default connect(state => ({articles: state.articles_collection, categories: state.distributions.data}))(Category);
