import React from 'react';
import ReactDOM from 'react-dom';
import { Input, Button, Form } from 'tapas-ui';

import AccountContainer from '#/components/Account/Account';
import InputMail from '#/components/InputMail/InputMail';

import validate from '#/utils/validate';

const FormItem = Form.Item;

export default class LoginPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        email: {
          value: undefined,
          isError: false
        },
        username: {
          value: undefined,
          isError: false
        },
        password: {
          value: undefined,
          isError: false
        }
      }
    };
  }

  componentDidUpdate(prevProps, prevState) {
    console.log(this.state)
  }

  render() {
    return (
      <div>
        <AccountContainer title='注册'>
          <Form>
            <FormItem
              hasFeedback
              validateStatus={this.state.formData.email.isError ? 'error' : ''}
              help='请正确输入邮箱'>
              <InputMail bubbleValue={::this.handleEmailChange} />
            </FormItem>
            <FormItem
              hasFeedback
              validateStatus={this.state.formData.username.isError ? 'error' : ''}
              help='请正确输入用户名'>
              <Input
                type='text'
                placeholder='您的名字'
                onChange={::this.handleNameChange} />
            </FormItem>
            <FormItem
              hasFeedback
              validateStatus={this.state.formData.password.isError ? 'error' : ''}
              help='请正确输入密码'>
              <Input
                type='password'
                placeholder='密码(字母、数字，至少6位)'
                onChange={::this.handlePasswordChange}  />
            </FormItem>
          </Form>
          <Button
            style={{marginTop: 10, width: 200}}
            type='primary'
            size='large'
            onClick={::this.handleSubmit}>
            注册
          </Button>
        </AccountContainer>
      </div>
    );
  }

  handleEmailChange(value) {
    let newFormData = Object.assign({}, this.state.formData);
    newFormData.email.value = value;
    this.setState({
      formData: newFormData
    });
  }

  handleNameChange(e) {
    let newFormData = Object.assign({}, this.state.formData);
    newFormData.username.value = e.target.value;
    this.setState({
      formData: newFormData
    });
  }

  handlePasswordChange(e) {
    let newFormData = Object.assign({}, this.state.formData);
    newFormData.password.value = e.target.value;
    this.setState({
      formData: newFormData
    });
  }

  handleSubmit(e) {
    e.preventDefault();
    let passValidate = true;
    const newFormData = Object.assign({}, this.state.formData);
    const items = Object.keys(this.state.formData);
    items.forEach(item => {
      const itemValue = this.state.formData[`${item}`].value;
      if (itemValue && ::this.validate(item, itemValue)) {
        newFormData[`${item}`].isError = false;
      } else {
        newFormData[`${item}`].isError = true;
        passValidate = false;
      }
    });
    this.setState({
      formData: newFormData
    });
    if (passValidate) {
      // do actions
      console.log('submit');
    }
  }

  validate(item, itemValue) {
    const testObj = {
      name: item,
      value: itemValue.trim()
    };
    return validate(testObj);
  }
}
