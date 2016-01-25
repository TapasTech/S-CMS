import React from 'react';
import {
  Table
} from 'tapas-ui';
import styles from './style.less';
import LibraryFilter from './LibraryFilter';
import reactMixin from 'react-mixin';
import * as Restful from '#/utils/restful';
import routerMixin from '#/utils/routerMixin';
import {allArticles} from '#/actions/libraries';
import {connect} from 'react-redux';
import moment from 'moment';
import ArticleView from './ArticleView';
import {flux} from '#/reducers';
import {query} from '#/utils/params';

class Internal extends React.Component {
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
      this.props.dispatch(flux.actionCreators.orgArticles.list(query()));
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
        this.props.dispatch(flux.actionCreators.orgArticles.list(query()));
      }
    }
    render() {
      const columns = [
        {
          title: '标题',
          dataIndex: 'title',
          key: 'title',
          render: (text, record, index) => <a onClick={() => (document.body.style.overflow = 'hidden') && this.setState({
            articlePicked: {
              articleId: record.key,
              categoryId: record.categoryId
            },
            showArticle: true
          })}>{text}</a>
        },
        {
          title: '产品端',
          dataIndex: 'product',
          key: 'product',
        },
        {
          title: '撰写机构',
          dataIndex: 'organization',
          key: 'organization'
        },
        {
          title: '状态',
          dataIndex: 'status',
          key: 'status'
        },
        {
          title: '发布时间',
          dataIndex: 'publishAt',
          key: 'publishAt'
        }
      ];

      const dataSource = this.props.articles.data && this.props.articles.data.map(article => ({
        key: article.id,
        title: article.dynamicFieldCollection.title,
        product: article.product && article.product.name || '没有字段',
        organization: article.organization && article.organization.name || '没有字段',
        status: article.status || '没有字段',
        publishAt: moment(article.publishAt).format('MM/DD HH:m'),
        categoryId: article.category.id
      }));

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

      return (
        <div className={styles.root}>
          <h1><b>企业内容库</b> 企业所有产品端生产的稿件汇总</h1>
          <div className={styles['main-container']}>
            <h2>稿件列表</h2>
            <hr/>
            <div className="table-container">
              <LibraryFilter timeFilter productFilter/>
              <Table loading={this.props.articles['@status'] === 'pending'} dataSource={dataSource} columns={columns} pagination={this.state.pagination} onChange={onChange}/>
            </div>
          </div>
          {
            this.state.articlePicked &&
            <div>
              <div className={this.state.showArticle ? "animated fadeIn shadow" : "animated fadeOut shadow"}>
              </div>
              <div className={this.state.showArticle ? "animated bounceInRight mask" : "animated bounceOutRight mask"}>
                <div className="back" onClick={() => (document.body.style.overflow = 'auto') && this.setState({...this.state, showArticle: false})}>
                </div>
                <div className="article-container">
                  <ArticleView articleId={this.state.articlePicked.articleId} orgId={this.props.params.orgId} productId={this.props.params.productId} categoryId={this.state.articlePicked.categoryId}/>
                </div>
              </div>
            </div>
          }
        </div>
      )
    }
}

reactMixin.onClass(Internal, routerMixin);
export default connect(state => ({articles: state.orgArticles_collection}))(Internal);
