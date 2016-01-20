import React from 'react';
import {
  Row,
  Col,
  Form,
  Input,
  Button,
  Switch,
  Editor,
  notification,
} from 'tapas-ui';
import Categories from './categories';
import editorConfig from './config';
import style from './style.less';
import ImageUploader from '#/components/ImageUploader/ImageUploader';

export default class EditView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.data = {dynamicFieldCollection: {}};
    this.prepareFields(props);
    this.defaultEditorEvents = {
      TUploadImage: (e, editor) => {
        this.onUploadImage(e.data).then(() => {
          e.callback(url);
        });
      },
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.data) {
      this.data = {
        dynamicFieldCollection: {},
        ...nextProps.data,
      };
      this.setState({data: this.data});
    }
  }

  componentWillUpdate(nextProps, nextState) {
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

  updateValue(key, val, rerender = true) {
    this.data.dynamicFieldCollection[key] = val;
    rerender && this.setState({data: this.data});
  }

  updateField(key, e) {
    this.updateValue(key, e.target.value);
  }

  buildFields() {
    return this.fields.additional.map(field => (
      <Form.Item key={field.mappingName} label={field.displayName}>{this.getField(field)}</Form.Item>
    ));
  }

  updateRichField(key, e, editor) {
    // Do not trigger `render`
    this.updateValue(key, editor.getContent(), false);
  }

  onUploadImage(file) {
    // TODO Upload image
    const url = URL.createObjectURL(file);
    return Promise.resolve(url);
  }

  getField(field) {
    let value = this.data.dynamicFieldCollection[field.mappingName];
    if (value == null && !this.data.id) value = field.defaultValue;
    switch (field.inputType) {
      case 'Switch':
        return (
          <Switch key={field.mappingName}
            checked={value}
            onChange={this.updateValue.bind(this, field.mappingName)}
          />
        );
      case 'Text':
        return (
          <Input type="text" key={field.mappingName}
            value={value}
            onChange={this.updateField.bind(this, field.mappingName)}
          />
        );
      case 'Richtext':
        const events = {
          change: this.updateRichField.bind(this, field.mappingName),
          ...this.defaultEditorEvents,
        };
        return (
          <Editor key={field.mappingName}
            config={editorConfig}
            events={events}
            content={value || ''}
          />
        );
      case 'Upload':
        return (
          <ImageUploader key={field.mappingName}
            value={value}
            onUploadImage={::this.onUploadImage}
            onChange={this.updateValue.bind(this, field.mappingName)}
          />
        );
      default:
        console.error(`Unsupported control type: ${field.inputType}`);
        return <span />;
    }
  }

  buildField(field) {
    return field ? (
      <Form.Item key={field.mappingName} label={field.displayName}>{this.getField(field)}</Form.Item>
    ): null;
  }

  render() {
    return (
      <div className={style.container}>
        <Row>
          <Col span="16">
            <h2>文章主体</h2>
            {this.buildField(this.fields.primary.title)}
            {this.buildField(this.fields.primary.summary)}
            {this.buildField(this.fields.primary.content)}
          </Col>
          <Col span="8" style={{paddingLeft: 16}}>
            <h2>附加信息</h2>
            {this.buildFields()}
          </Col>
        </Row>
        <footer className={style.buttons}>
          {this.props.onSave && <Button type="primary" onClick={::this.handleSave}>保存</Button>}
          <Button type="primary" onClick={::this.handlePublish}>发布</Button>
          <Button onClick={this.props.onCancelled}>取消</Button>
        </footer>
        {!this.data.category && <Categories handleOk={::this.doPublish} visible={this.state.selectingCategories} />}
      </div>
    );
  }

  validate() {
    return new Promise((resolve, reject) => {
      const values = this.data.dynamicFieldCollection;
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
    return this.validate()
    .then(() => this.props.onSave(this.data));
  }

  doPublish(categoryIds) {
    return this.props.onPublish(this.data, categoryIds)
    .then(() => {
      this.setState({selectingCategories: false});
    })
    .then(this.props.onPublished);
  }

  handleSave() {
    this.doSave()
    .then(this.props.onSaved);
  }

  handlePublish() {
    this.validate()
    .then(() => this.props.onBeforePublish && this.props.onBeforePublish(this.data))
    .then(() => this.data.dategory
      ? this.doPublish([this.data.category.id])
      : this.setState({selectingCategories: true})
    );
  }
}
