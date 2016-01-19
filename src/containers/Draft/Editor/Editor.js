import React from 'react';
import {connect} from 'react-redux';
import {pushState} from 'redux-router';
import {Row, Col, Form, Input, Button, Editor} from 'tapas-ui';
import editorConfig from './config';
import style from './style.less';

import * as actionsForDrafts from '#/actions/drafts';
import * as actionsForConfigs from '#/actions/configs';

class EditorView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.draft = {};
    this.fields = {primary: {}, additional: []};
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
    if (this.props.fields != nextProps.fields) {
      const primary = ['title', 'summary', 'content'];
      this.fields = {
        primary: {},
        additional: [],
      };
      nextProps.fields.forEach(field => {
        if (primary.includes(field.mappingName)) {
          this.fields.primary[field.mappingName] = field;
        } else {
          this.fields.additional.push(field);
        }
      });
    }
  }

  loadFields(props) {
    props = props || this.props;
    const tid = props.params.draftTypeId;
    tid && props.dispatch([
      actionsForConfigs.drafts.show({id: tid}),
    ]);
  }

  loadData(props) {
    props = props || this.props;
    const id = props.params.draftId;
    if (id === 'new') {
      props.dispatch([
        actionsForDrafts.clear(),
      ]);
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

  buildFields() {
    return this.fields.additional.map(::this.getTextField);
  }

  updateRichField(key, e, editor) {
    this.draft[key] = editor.getContent();
    // Do not trigger `render`
  }

  onUploadImage(e, editor) {
    const url = URL.createObjectURL(e.data);
    editor.on('remove', () => URL.revokeObjectURL(url));
    e.callback(url);
  }

  getTextField(field) {
    switch (field.inputType) {
      case 'Text':
        return <Input type="text" value={this.draft[field.mappingName]} onChange={this.updateField.bind(this, field.mappingName)} />;
      case 'Richtext':
        const events = {
          change: this.updateRichField.bind(this, field.mappingName),
          ...this.editorEvents,
        };
        return <Editor config={editorConfig} events={events} content={this.draft.content || ''} />;
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
        actionsForDrafts.update({
          id,
          ...this.draft
        }),
      ]).then(() => this.transitionToList());
    }
    this.setState({loading: true});
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
