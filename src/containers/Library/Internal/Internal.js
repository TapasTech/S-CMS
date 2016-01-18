import React from 'react';
import {
  Table
} from 'tapas-ui';
import styles from './style.less';
import LibraryFilter from './LibraryFilter';
import reactMixin from 'react-mixin';
import * as Restful from '#/utils/restful';
import routerMixin from '#/utils/routerMixin';



export default class Internal extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: true
      }
    }
    async componentWillMount() {
      this.setState({
        ...this.state,
        pagination: {
          current: Number(this.getUrlQuery('page') || 1)
        }
      });

      const categoriesRequest = Restful.collection('organizations').model('5695f0095e98be65ba000014').collection('products').model('5695f3df5e98be65ba000016').collection('categories');
      try {
        const categoryIds = (await categoriesRequest.get()).data.map(category => category.id);
        const articlesRequest = categoryIds.map(id => {
          return categoriesRequest.model(id).collection('articles').get()}
        );
        const articlesResponse = await Promise.all(articlesRequest);
        let articles = articlesResponse.map(res => res.data);
        articles = articles.reduce((prev, cur) => prev.concat(cur), []);
        this.setState({
          ...this.state,
          loading: false,
          articles
        });
      } catch(err) {
        console.log(err);
      }
    }
    render() {
      const columns = [
        {
          title: '标题',
          dataIndex: 'title',
          key: 'title'
        },
        {
          title: '产品端',
          dataIndex: 'platform',
          key: 'platform',
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

      const dataSource = this.state.articles && this.state.articles.map((article, index) => {
        return {
          key: index,
          title: article.dynamic_field_collection.title,
          platform: '没有字段',
          organization: '没有字段',
          status: article.status,
          publishAt: article.publish_at
        }
      });

      const onChange = event => {
        this.addQuery({page: event.current});
        this.setState({
          ...this.setState,
          pagination: {
            current: Number(event.current)
          }
        });
      }

      return (
        <div className={styles.root}>
          <LibraryFilter time platform source organization/>
          <Table loading={this.state.loading} dataSource={dataSource} columns={columns} pagination={this.state.pagination} onChange={onChange}/>
        </div>
      )
    }
}

reactMixin.onClass(Internal, routerMixin);
