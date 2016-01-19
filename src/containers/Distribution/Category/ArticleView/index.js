import React from 'react';
import {
  Row,
  Col,
  Button,
  Spin
} from 'tapas-ui';
import styles from './style.less';
import {flux} from '#/reducers';
import {query, path} from '#/utils/params';
import {connect} from 'react-redux';
import {pushState} from 'redux-router';
import {fetch} from '#/utils/restful';
import moment from 'moment';

class ArticleView extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.dispatch(flux.actionCreators.articles.retrieve(this.props.id));
  }
  componentWillReceiveProps(nextProps) {
    if(nextProps.id !== this.props.id) this.props.dispatch(flux.actionCreators.articles.retrieve(nextProps.id));
  }
  render() {
    const title = this.props.article.data && this.props.article.data.dynamicFieldCollection.title;
    const content = this.props.article.data && this.props.article.data.dynamicFieldCollection.content;
    const summary = this.props.article.data && this.props.article.data.dynamicFieldCollection.summary;
    const author = this.props.article.data && this.props.article.data.dynamicFieldCollection.author || '没有字段';
    const organization = this.props.article.data && this.props.article.data.organization || '没有字段';
    const origin = this.props.article.data && this.props.article.data.origin || '没有字段';
    const publishAt = this.props.article.data && moment(this.props.article.data.publishAt).format('YYYY-MM-DD HH:mm');
    const originUrl = this.props.article.data && this.props.article.data.originUrl || '没有字段';

    const params = path();
    const publish = () => {
      return fetch(`organizations/${params.orgId}/products/${params.productId}/categories/${params.categoryId}/articles/${this.props.id}/_publish`)
      .post().then(res => this.props.dispatch(flux.actionCreators.articles.retrieve(this.props.id)));
    };
    const unpublish = () => {
      return fetch(`organizations/${params.orgId}/products/${params.productId}/categories/${params.categoryId}/articles/${this.props.id}/_unpublish`)
      .post().then(res => this.props.dispatch(flux.actionCreators.articles.retrieve(this.props.id)));
    };
    return (
      this.props.article['@status'] !== 'saved'
      ?
      <Row style={{backgroundColor: 'white'}}>
        <Col span="4" offset="10">
          <div>
            <Spin />
          </div>
        </Col>
      </Row>
      :
      <Row className={styles['article-container']}>
        <Col span="20" >
          <div >
            <h1>{title}</h1>
            <div className="abstract">{summary}</div>
            <div dangerouslySetInnerHTML={{__html:content}}></div>
          </div>
        </Col>
        <Col span="4" >
          <div className="aside">
            <Row>
              <Button onClick={() => this.props.dispatch(pushState(null, `/${params.orgId}/${params.productId}/distribution/${params.categoryId}/${params.articleId || this.props.id}/edit`))}>修改</Button>
              {
                this.props.article.data.status === 'published'
                ?
                  <Button onClick={unpublish}>下线</Button>
                :
                  <Button onClick={publish}>上线</Button>
              }
            </Row>
            <Row>
              <h2>文章信息</h2>
              <hr />
              <Col span="8">作者：</Col>
              <Col span="16">{author}</Col>
              <Col span="8">撰写机构：</Col>
              <Col span="16">{organization}</Col>
              <Col span="8">新闻来源：</Col>
              <Col span="16">{origin}</Col>
              <Col span="8">发布时间：</Col>
              <Col span="16">{publishAt}</Col>
              <Col span="8">原始链接</Col>
              <Col span="16">点击查看原文</Col>
              </Row>
          </div>
        </Col>
      </Row>
    )
  }
}

export default connect(state => ({article: state.articles_item}))(ArticleView)
