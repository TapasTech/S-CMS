import React from 'react';
import { Form, Input, Button } from 'tapas-ui';

const FormItem = Form.Item;

export default class OrgSettings extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        orgName: '',
        orgDesc: ''
      }
    };
  }

  render() {
    return (
      <Form className='content'>
        <label>企业名称：</label>
        <FormItem>
          <Input type='text' onChange={::this.handleOrgNameChange} />
        </FormItem>
        <label>企业介绍：</label>
        <FormItem>
          <Input type='text' onChange={::this.handleOrgDescChange} />
        </FormItem>
        <Button
          style={{width: 150, marginTop: 15}}
          type='primary'
          size='large'
          onClick={::this.handleSaveClick}>保存</Button>
      </Form>
    );
  }

  handleOrgNameChange(e) {
    const value = e.target.value;
    let newFormData = Object.assign({}, this.state.formData);
    newFormData.orgName = value;
    this.setState({
      formData: newFormData
    });
  }

  handleOrgDescChange(e) {
    const value = e.target.value;
    let newFormData = Object.assign({}, this.state.formData);
    newFormData.orgDesc = value;
    this.setState({
      formData: newFormData
    });
  }

  handleSaveClick() {
    console.log('submit', this.state.formData);
  }
}
