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

class ArticleView extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    this.props.dispatch(flux.actionCreators.articles.retrieve(this.props.id));
  }
  render() {
    const title = this.props.article.data && this.props.article.data.dynamicFieldCollection.title;
    const content = this.props.article.data && this.props.article.data.dynamicFieldCollection.content;
    const summary = this.props.article.data && this.props.article.data.dynamicFieldCollection.summary;

    return (
      this.props.article['@status'] === 'pending'
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
            <div>{content}</div>
          </div>
        </Col>
        <Col span="4" >
          <div className="aside">
            <Row>
              <Button>编辑邮件</Button>
              <Button>加入稿件</Button>
            </Row>
            <Row>
              <h2>文章信息</h2>
              <hr />
              <Col span="8">作者：</Col>
              <Col span="16">东方财富网</Col>
              <Col span="8">撰写机构：</Col>
              <Col span="16">天天基金网</Col>
              <Col span="8">新闻来源：</Col>
              <Col span="16">东方财富网</Col>
              <Col span="8">发布时间：</Col>
              <Col span="16">2016-01-04  12:01</Col>
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
