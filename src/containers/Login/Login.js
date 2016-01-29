import React from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { Input, Button, Form } from 'tapas-ui';

import * as actionsForUser from '#/actions/user';

import AccountContainer from '#/components/Account/Account';
import InputMail from '#/components/InputMail/InputMail';

import validate from '#/utils/validate';

const FormItem = Form.Item;

class LoginPage extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        email: {
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
        <AccountContainer title='登录'>
          <Form>
            <FormItem
              hasFeedback
              validateStatus={this.state.formData.email.isError ? 'error' : ''}
              help='请正确输入邮箱'>
              <InputMail bubbleValue={::this.handleEmailChange} />
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
              <Link to="/register" style={{ color: '#fff' }}>还没有帐号？</Link>
            </div>
            <Button
              style={{marginTop: 10, width: 200}}
              type='primary'
              htmlType='submit'
              size='large'
              onClick={::this.handleSubmit}>
              登录
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
      this.props.dispatch(actionsForUser.login({
        email: this.state.formData.email.value,
        password: this.state.formData.password.value
      }));
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

export default connect(state => ({}))(LoginPage);
