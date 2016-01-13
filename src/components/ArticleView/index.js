import React from 'react';
import {
  Row,
  Col,
  Button
} from 'tapas-ui';
import styles from './style.less';

export default class ArticleView extends React.Component {
  render() {
    return (
      <Row>
        <Col span="20" >
          <div className={styles['article-container']}>
            <h1>标题</h1>
            <div className="abstract">摘要</div>
            <div>内容</div>
          </div>
        </Col>
        <Col span="4" >
          <div className={styles['aside']}>
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
