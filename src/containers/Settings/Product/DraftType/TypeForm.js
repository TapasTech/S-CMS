import React from 'react';
import { connect } from 'react-redux';
import {
  Form,
  Input,
  Button,
  Radio
} from 'tapas-ui';

import * as actionsForConf from '#/actions/configs';

import { fieldsTypeColumns } from '../table-columns';

const FormItem = Form.Item;
const RadioGroup = Radio.Group;

const dataSource = [
  {
    id: '001',
    key: '1a',
    name_zh: '标题',
    name_map: 'title',
    field_type: '文本',
    required: 'true',
    default_value: undefined,
    widget: '文本输入框',
    editable: false,
  }, {
    id: '002',
    key: '2a',
    name_zh: '正文',
    name_map: 'content',
    field_type: '富文本',
    required: 'true',
    default_value: undefined,
    widget: '富文本编辑器',
    editable: false,
  }, {
    id: '003',
    key: '3a',
    name_zh: '新闻来源',
    name_map: 'origin',
    field_type: '文本',
    required: 'false',
    default_value: '第一财经｜CBN',
    widget: '文本输入框',
    editable: true,
  }
];

class TypeForm extends React.Component {
  static propTypes = {
    onSave: React.PropTypes.func
  };

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        draft_name: undefined,
        type_name: 'regular'
      },
      validateStatus: {
        draft_name: false
      }
    };
  }

  render() {
    return (
      <Form horizontal className='type-form'>
        <FormItem
          hasFeedback
          validateStatus={this.state.validateStatus.draft_name ? 'error' : ''}
          help='请输入稿件类型名称'>
          <Input
            type='text'
            placeholder='稿件类型名称'
            value={this.state.formData.draft_name}
            onChange={this.handleFormChange.bind(this, 'draft_name')} />
        </FormItem>
        <div>稿件类型</div>
        <FormItem>
          <RadioGroup
            value={this.state.formData.type_name}
            onChange={this.handleFormChange.bind(this, 'type_name')}>
            <Radio value='regular'>普通稿件</Radio>
            <Radio value='live'>直播稿件</Radio>
          </RadioGroup>
        </FormItem>
        <Button type='primary' onClick={::this.handleOnSave}>创建</Button>
      </Form>
    );
  }

  // handle form value changes
  handleFormChange(name, e) {
    const value = e.target ? e.target.value : e;
    let newFormData = Object.assign({}, this.state.formData);
    newFormData[name] = value;
    this.setState({
      formData: newFormData
    });
  }

  handleOnSave() {
    const formData = this.state.formData;
    const newValidateStatus = Object.assign({}, this.state.validateStatus);
    if (formData.draft_name) {
      newValidateStatus.draft_name = false;
      this.props.dispatch(actionsForConf.drafts.create({
        name: formData.draft_name
      })).then(res => {
        this.props.onSave(res);
      });
    } else {
      newValidateStatus.draft_name = true;
    }
    this.setState({
      validateStatus: newValidateStatus
    });
  }
}

export default connect(state => ({
  drafts: state.configs.drafts.data
}))(TypeForm);
