import React from 'react';
import {Row, Col, Form, Input, Button, Editor} from 'tapas-ui';
import editorConfig from './config';
import style from './style.less';

export default class EditorView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      formData: this.formData = {},
    };
    this.editorEvents = {
      change: ::this.contentChange,
      TUploadImage: ::this.onUploadImage,
    };
  }

  componentDidMount() {
    setTimeout(() => {
      this.setState({
        formData: this.formData = {
          title: 'title',
          summary: 'summary',
          content: 'content',
          author: 'author',
        },
      });
    }, 1000);
  }

  updateField(key, value) {
    this.formData[key] = value;
  }

  contentChange(e, editor) {
    this.updateField('content', editor.getContent());
  }

  onUploadImage(e, editor) {
    const url = URL.createObjectURL(e.data);
    editor.on('remove', () => URL.revokeObjectURL(url));
    e.callback(url);
  }

  render() {
    const formData = this.state.formData;
    return (
      <div className={style.container}>
        <Row>
          <Col span="16">
            <h2>文章主体</h2>
            <Form.Item label="标题">
              <Input type="text" value={formData.title} onChange={this.updateField.bind(this, 'title')} />
            </Form.Item>
            <Form.Item label="摘要">
              <Input type="textarea" value={formData.summary} onChange={this.updateField.bind(this, 'summary')} />
            </Form.Item>
            <Form.Item label="正文">
              <Editor config={editorConfig} events={this.editorEvents} content={formData.content} />
            </Form.Item>
          </Col>
          <Col span="8" style={{paddingLeft: 16}}>
            <h2>附加信息</h2>
            <Form.Item label="作者">
              <Input
                type="text" value={formData.author} placeholder="请填写作者"
                onChange={this.updateField.bind(this, 'author')}
              />
            </Form.Item>
          </Col>
        </Row>
        <footer className={style.buttons}>
          <Button type="primary">保存</Button>
          <Button type="primary">发布</Button>
          <Button>取消</Button>
        </footer>
      </div>
    );
  }
};
