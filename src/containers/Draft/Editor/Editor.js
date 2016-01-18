import React from 'react';
import {connect} from 'react-redux';
import {pushState} from 'redux-router';
import {Row, Col, Form, Input, Button, Editor} from 'tapas-ui';
import editorConfig from './config';
import style from './style.less';
import TYPE from '#/constants';

import * as actionsForDrafts from '#/actions/drafts';

class EditorView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.draft = {};
    this.editorEvents = {
      change: ::this.onContentChange,
      TUploadImage: ::this.onUploadImage,
    };
  }

  componentDidMount() {
    this.loadData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.draft) {
      this.draft = nextProps.draft;
      this.setState({draft: this.draft});
    }
    if (this.state.action === 'SAVE') {
      this.transitionToList();
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.params.draftId != nextProps.params.draftId) {
      this.loadData(nextProps);
    }
  }

  loadData(props) {
    props = props || this.props;
    const id = props.params.draftId;
    if (id === 'new') {
      props.dispatch([{
        type: TYPE.DRA.SHOW,
        payload: {},
      }]);
      this.setState({loading: false});
    } else {
      props.dispatch([
        actionsForDrafts.show({id: props.params.draftId}),
      ]);
      this.setState({loading: true});
    }
  }

  updateField(key, e) {
    this.draft[key] = e.target.value;
    this.setState({
      draft: this.draft
    });
  }

  onContentChange(e, editor) {
    this.draft.content = editor.getContent();
    // Do not trigger `render`
  }

  onUploadImage(e, editor) {
    const url = URL.createObjectURL(e.data);
    editor.on('remove', () => URL.revokeObjectURL(url));
    e.callback(url);
  }

  render() {
    const draft = this.draft;
    return (
      <div className={style.container}>
        <Row>
          <Col span="16">
            <h2>文章主体</h2>
            <Form.Item label="标题">
              <Input type="text" value={draft.title} onChange={this.updateField.bind(this, 'title')} />
            </Form.Item>
            <Form.Item label="摘要">
              <Input type="textarea" value={draft.summary} onChange={this.updateField.bind(this, 'summary')} />
            </Form.Item>
            <Form.Item label="正文">
              <Editor config={editorConfig} events={this.editorEvents} content={draft.content || ''} />
            </Form.Item>
          </Col>
          <Col span="8" style={{paddingLeft: 16}}>
            <h2>附加信息</h2>
            <Form.Item label="作者">
              <Input
                type="text" value={draft.author} placeholder="请填写作者"
                onChange={this.updateField.bind(this, 'author')}
              />
            </Form.Item>
          </Col>
        </Row>
        <footer className={style.buttons}>
          <Button type="primary" onClick={::this.handleSave}>保存</Button>
          <Button type="primary">发布</Button>
          <Button onClick={::this.handleCancel}>取消</Button>
        </footer>
      </div>
    );
  }

  handleCancel() {
    this.transitionToList();
  }

  handleSave() {
    const id = this.props.params.draftId;
    if (id === 'new') {
      this.props.dispatch([
        actionsForDrafts.create(this.draft),
      ]);
    } else {
      this.props.dispatch([
        actionsForDrafts.update({id, ...this.draft}),
      ]);
    }
    this.setState({loading: true, action: 'SAVE'});
  }

  transitionToList() {
    const params = this.props.params;
    const pathname = `/${params.orgId}/${params.productId}/draft/${params.draftTypeId}`;
    this.props.dispatch([
      pushState(null, pathname),
    ]);
  }
}

export default connect(state => ({
  draft: state.drafts.current
}))(EditorView);
