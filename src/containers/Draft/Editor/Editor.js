import React from 'react';
import {connect} from 'react-redux';
import {pushState} from 'redux-router';
import {Row, Col, Form, Input, Button, Editor, notification} from 'tapas-ui';
import Categories from './categories';
import editorConfig from './config';
import style from './style.less';

import * as actionsForDrafts from '#/actions/drafts';
import * as actionsForConfigs from '#/actions/configs';

class EditorView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.draft = {dynamicFieldCollection: {}};
    this.prepareFields(props);
    this.editorEvents = {
      TUploadImage: ::this.onUploadImage,
    };
  }

  componentWillMount() {
    this.loadFields();
    this.loadData();
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.draft) {
      this.draft = nextProps.draft;
      this.setState({draft: this.draft});
    }
  }

  componentWillUpdate(nextProps, nextState) {
    if (this.props.params.draftId != nextProps.params.draftId) {
      this.loadData(nextProps);
    }
    if (this.props.params.draftTypeId != nextProps.params.draftTypeId) {
      this.loadFields(nextProps);
    }
    if (this.props.fields !== nextProps.fields) {
      this.prepareFields(nextProps);
    }
  }

  prepareFields(props) {
    const primary = ['title', 'summary', 'content'];
    this.fields = {
      primary: {},
      additional: [],
    };
    props.fields && props.fields.forEach(field => {
      if (primary.includes(field.mappingName)) {
        this.fields.primary[field.mappingName] = field;
      } else {
        this.fields.additional.push(field);
      }
    });
  }

  loadFields(props) {
    props = props || this.props;
    const tid = props.params.draftTypeId;
    tid && props.dispatch(
      actionsForConfigs.drafts.show({id: tid})
    );
  }

  loadData(props) {
    props = props || this.props;
    this.draft.id = props.params.draftId;
    if (this.draft.id === 'new') this.draft.id = '';
    if (!this.draft.id) {
      props.dispatch(
        actionsForDrafts.clear()
      );
      this.setState({loading: false});
    } else {
      props.dispatch(
        actionsForDrafts.show({id: this.draft.id})
      );
      this.setState({loading: true});
    }
  }

  updateField(key, e) {
    this.draft.dynamicFieldCollection[key] = e.target.value;
    this.setState({
      draft: this.draft
    });
  }

  buildFields() {
    return this.fields.additional.map(field => (
      <Form.Item label={field.displayName}>{this.getTextField(field)}</Form.Item>
    ));
  }

  updateRichField(key, e, editor) {
    this.draft.dynamicFieldCollection[key] = editor.getContent();
    // Do not trigger `render`
  }

  onUploadImage(e, editor) {
    const url = URL.createObjectURL(e.data);
    editor.on('remove', () => URL.revokeObjectURL(url));
    e.callback(url);
  }

  getTextField(field) {
    const values = this.draft.dynamicFieldCollection;
    switch (field.inputType) {
      case 'Text':
        return <Input type="text" value={values[field.mappingName]} onChange={this.updateField.bind(this, field.mappingName)} />;
      case 'Richtext':
        const events = {
          change: this.updateRichField.bind(this, field.mappingName),
          ...this.editorEvents,
        };
        return <Editor config={editorConfig} events={events} content={values.content || ''} />;
    }
  }

  buildTextField(field) {
    return field ? (
      <Form.Item label={field.displayName}>{this.getTextField(field)}</Form.Item>
    ): null;
  }

  render() {
    return (
      <div className={style.container}>
        <Row>
          <Col span="16">
            <h2>文章主体</h2>
            {this.buildTextField(this.fields.primary.title)}
            {this.buildTextField(this.fields.primary.summary)}
            {this.buildTextField(this.fields.primary.content)}
          </Col>
          <Col span="8" style={{paddingLeft: 16}}>
            <h2>附加信息</h2>
            {this.buildFields()}
          </Col>
        </Row>
        <footer className={style.buttons}>
          <Button type="primary" onClick={::this.handleSave}>保存</Button>
          <Button type="primary" onClick={::this.handlePublish}>发布</Button>
          <Button onClick={::this.handleCancel}>取消</Button>
        </footer>
        <Categories handleOk={::this.doPublish} visible={this.state.publishing} />
      </div>
    );
  }

  validateDraft() {
    return new Promise((resolve, reject) => {
      const values = this.draft.dynamicFieldCollection;
      if (!values.title) return reject('请填写标题！');
      if (!values.content) return reject('请填写内容！');
      resolve();
    }).catch(err => {
      notification.error({
        message: err || '验证失败！',
      });
      return Promise.reject();
    });
  }

  doSave() {
    return this.validateDraft()
    .then(() => {
      this.setState({loading: true});
      return this.props.dispatch(
        this.draft.id
          ? actionsForDrafts.update(this.draft)
          : actionsForDrafts.create(this.draft)
      );
    });
  }

  doPublish(categoryIds) {
    Promise.all(this.props.dispatch(
      categoryIds.map(categoryId => actionsForDrafts.publish({
        id: this.draft.id,
        categoryId,
      }))
    ))
    .then(() => this.transitionToList());
    this.setState({publishing: false});
  }

  handleCancel() {
    this.transitionToList();
  }

  handleSave() {
    this.doSave()
    .then(::this.transitionToList)
  }

  handlePublish() {
    this.doSave()
    .then(() => this.setState({publishing: true}));
  }

  transitionToList() {
    const params = this.props.params;
    const pathname = `/${params.orgId}/${params.productId}/draft/${params.draftTypeId}`;
    this.props.dispatch(pushState(null, pathname));
  }
}

export default connect(state => ({
  draft: state.drafts.current,
  fields: state.configs.fields.data,
}))(EditorView);
