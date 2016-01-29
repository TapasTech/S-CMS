import React from 'react';
import ReactDOM from 'react-dom';
import { Button, Modal, Input, Form, Icon } from 'tapas-ui';

import validate from '#/utils/validate';

import styles from './style.less';

const FormItem = Form.Item;

export default class Interface extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      showDevModal: false,
      showServModal: false,
      url: {
        value: undefined,
        status: false
      }
    };
  }

  handleDevConfig() {
    this.setState({
      showDevModal: true
    });
  }

  handleDevOk() {
    // do actions
    this.setState({
      showDevModal: false
    });
  }

  handleDevCancel() {
    this.setState({
      showDevModal: false
    });
  }

  handleFormChange(e) {
    let newUrl = Object.assign({}, this.state.url);
    newUrl.value = e.target.value;
    this.setState({
      url: newUrl
    });
  }

  handleServConfig() {
    this.setState({
      showServModal: true
    });
  }

  handleServOk() {
    const { value, status } = this.state.url;
    let passValidate = true;
    let newUrl = Object.assign(this.state.url);
    if (value) {
      if (this.validate('url', value)) {
        newUrl.status = false;
        // do actions
        // console.log('submit', this.state.url);
        this.setState({
          url: newUrl,
          showServModal: false
        });
      } else {
        newUrl.status = true;
        this.setState({
          url: newUrl
        });
      }
    }
  }

  handleServCancel() {
    this.setState({
      showServModal: false
    });
  }

  validate(item, itemValue) {
    const testObj = {
      name: item,
      value: itemValue.trim()
    };
    return validate(testObj);
  }

  renderDevInfo() {
    return (
      <div className='developer'>
        <div className='title'>开发者ID</div>
        <div className='info'>
          <div className='tip'>AppID(应用ID)</div>
          <div>2Y362teyjG438Nw</div>
        </div>
        <div className='info'>
          <div className='tip'>AppSecret(应用密钥)</div>
          <div>atdWzH2ZEeb5fBeZapjxvG8W</div>
          <div className='reset-btn' onClick={::this.handleDevConfig}>重置</div>
        </div>
        <Modal
          key='dev'
          title='重置密钥'
          visible={this.state.showDevModal}
          onOk={::this.handleDevOk}
          onCancel={::this.handleDevCancel}
          okText='确定'
          cancelText='取消'>
          <div className={styles.resetConfirm}>
            <Icon type='exclamation-circle' />
            <div className='info'>
              <div>您是否确认要重置appsecret吗？</div>
              <div className='tip'>重置appsecret立即生效。所有使用旧appsecret的接口将立即失效</div>
            </div>
          </div>
        </Modal>
      </div>
    );
  }

  renderServerInfo() {
    return (
      <div className='server'>
        <div className='title'>
          <div className='tip'>服务器配置</div>
          <Button type='primary' onClick={::this.handleServConfig}>修改配置</Button>
        </div>
        <div className='info'>
          <div className='tip'>URL(服务器地址)</div>
          <div>未填写</div>
        </div>
        <Modal
          key='server'
          title='修改服务器配置'
          visible={this.state.showServModal}
          onOk={::this.handleServOk}
          onCancel={::this.handleServCancel}
          okText='确定'
          cancelText='取消'>
          <Form horizontal>
            <FormItem
              hasFeedback
              validateStatus={this.state.url.status ? 'error' : ''}
              help={'请输入正确URL'} >
              <Input
                type='text'
                value={this.state.url.value}
                onChange={::this.handleFormChange}
                placeholder='输入URL' />
            </FormItem>
            <div className={styles.tip}>必须以http://或https://开头，分别支持80端口和443端口。</div>
          </Form>
        </Modal>
      </div>
    );
  }

  render() {
    return (
      <div className='interface'>
        {this.renderDevInfo()}
        {this.renderServerInfo()}
      </div>
    );
  }
}
