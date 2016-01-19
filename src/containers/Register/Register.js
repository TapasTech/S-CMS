import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Input, Button, Form } from 'tapas-ui';

import * as actionsForUser from '#/actions/user';

import AccountContainer from '#/components/Account/Account';
import InputMail from '#/components/InputMail/InputMail';

import validate from '#/utils/validate';

const FormItem = Form.Item;

class RegisterPage extends React.Component {

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
            <div style={{ textAlign: 'left' }}>
              <Link to="/login" style={{ color: '#fff' }}>返回登录</Link>
            </div>
            <Button
              style={{marginTop: 10, width: 200}}
              type='primary'
              htmlType='submit'
              size='large'
              onClick={::this.handleSubmit}>
              注册
            </Button>
          </Form>
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
      const { email, password, username } = this.state.formData;
      this.props.dispatch(actionsForUser.register({
        email: email.value,
        password: password.value,
        name: username.value
      }))
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

export default connect(state => ({}))(RegisterPage)
