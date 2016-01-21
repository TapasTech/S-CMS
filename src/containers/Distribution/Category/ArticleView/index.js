import React from 'react';
import {
  Row,
  Col,
  Button,
  Spin
} from 'tapas-ui';
import styles from './style.less';
import {flux} from '#/reducers';
import {query} from '#/utils/params';
import {connect} from 'react-redux';
import {pushState} from 'redux-router';
import {fetch} from '#/utils/restful';
import moment from 'moment';


class ArticleView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  componentWillMount() {
    this.props.dispatch(flux.actionCreators.articles.retrieve(this.props.articleId, {
      orgId: this.props.orgId,
      productId: this.props.productId,
      categoryId: this.props.categoryId
    }));
  }
  shouldComponentUpdate(nextProps, nextState) {
    if(nextProps.articleId !== this.props.articleId) {
      this.props.dispatch(flux.actionCreators.articles.retrieve(nextProps.articleId, {
        orgId: nextProps.orgId,
        productId: nextProps.productId,
        categoryId: nextProps.categoryId}
      ));
      return false;
    }
    return true;
  }

  unpublish() {
    this.setState({
      status: 'unpublishing'
    });
    return fetch(`organizations/${this.props.orgId}/products/${this.props.productId}/categories/${this.props.categoryId}/articles/${this.props.articleId}/_unpublish`)
    .post()
    .then(res => {
      this.setState({
        status: 'unpublished'
      });
      return this.props.dispatch(flux.actionCreators.articles.retrieve(this.props.articleId));
    })
  }

  publish() {
    this.setState({
      status: 'publishing'
    });
    return fetch(`organizations/${this.props.orgId}/products/${this.props.productId}/categories/${this.props.categoryId}/articles/${this.props.articleId}/_publish`)
    .post()
    .then(res => {
      this.setState({
        status: 'published'
      })
      return this.props.dispatch(flux.actionCreators.articles.retrieve(this.props.articleId));
    });
  };

  render() {
    const title = this.props.article.data && this.props.article.data.dynamicFieldCollection.title;
    const content = this.props.article.data && this.props.article.data.dynamicFieldCollection.content;
    const summary = this.props.article.data && this.props.article.data.dynamicFieldCollection.summary;
    const author = this.props.article.data && this.props.article.data.dynamicFieldCollection.author || '没有字段';
    const organization = this.props.article.data && this.props.article.data.organization || '没有字段';
    const origin = this.props.article.data && this.props.article.data.origin || '没有字段';
    const publishAt = this.props.article.data && moment(this.props.article.data.publishAt).format('YYYY-MM-DD HH:mm');
    const originUrl = this.props.article.data && this.props.article.data.originUrl || '没有字段';

    return (
      this.props.article['@status'] !== 'saved'
      ?
      <Row>
        <Col span="4" offset="10">
          <div>
            <Spin />
          </div>
        </Col>
      </Row>
      :
      <Row className={styles['article-container']}>
        <Col span="20">
          <div className="article">
            <h1>{title}</h1>
            <div className="abstract">{summary}</div>
            <div dangerouslySetInnerHTML={{__html:content}}></div>
          </div>
        </Col>
        <Col span="4" >
          <div className={styles['aside']}>
            <Row>
              <Button onClick={() => this.props.dispatch(pushState(null, `/${this.props.orgId}/${this.props.productId}/distribution/${this.props.categoryId}/${this.props.articleId}/edit`))}>修改</Button>
              {
                this.props.article.data.status === 'published'
                ?
                  <Button onClick={::this.unpublish} loading={this.state.status === 'unpublishing'}>下线</Button>
                :
                  <Button onClick={::this.publish} loading={this.state.status === 'publishing'}>上线</Button>
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
