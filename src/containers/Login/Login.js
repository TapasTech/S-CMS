import React from 'react';
import { Input, Button, Form } from 'tapas-ui';

import AccountContainer from '#/components/Account/Account';
import InputMail from '#/components/InputMail/InputMail';

const FormItem = Form.Item;

export default class LoginPage extends React.Component {

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div>
        <AccountContainer title='登录'>
          <Form>
            <FormItem
              hasFeedback
              validateStatus = 'validating'
              help = '请输入数字和字母组合'>
              <InputMail />
            </FormItem>
            <FormItem
              hasFeedback
              validateStatus = 'validating'
              help = '请输入数字和字母组合'>
              <Input type='password' placeholder='密码' />
            </FormItem>
            <Button style={{marginTop: 10, width: 200}} type='primary' size='large'>登录</Button>
          </Form>
        </AccountContainer>
      </div>
    );
  }
}
