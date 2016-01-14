import React from 'react';
import { Form, Input, Button } from 'tapas-ui';

const FormItem = Form.Item;

export default class ProductInfo extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        name: '',
        desc: ''
      }
    };
  }

  render() {
    return (
      <Form className='content'>
        <label>产品端名称：</label>
        <FormItem>
          <Input type='text' onChange={::this.handleNameChange} />
        </FormItem>
        <label>产品端介绍：</label>
        <FormItem>
          <Input type='text' onChange={::this.handleDescChange}  />
        </FormItem>
        <Button
          style={{width: 150, marginTop: 15}}
          type='primary'
          size='large'
          onClick={::this.handleSaveClick}>保存</Button>
      </Form>
    );
  }

  handleNameChange(e) {
    const value = e.target.value;
    let newFormData = Object.assign({}, this.state.formData);
    newFormData.orgName = value;
    this.setState({
      formData: newFormData
    });
  }

  handleDescChange(e) {
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

