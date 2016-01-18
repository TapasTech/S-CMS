import React from 'react';
import {
  Button,
  Table,
  Modal,
  Form,
  Input
} from 'tapas-ui';

import history from '#/utils/history';
import BoxList from '#/components/BoxList/BoxList';

const FormItem = Form.Item;

export default class ProductList extends React.Component {
  static defaultProps = {
    list: [
      {title: '产品端A', id: '1'},
      {title: '产品端B', id: '2'},
      {title: '产品端C', id: '3'},
      {title: '产品端D', id: '4'}
    ]
  };

  static propTypes = {
    list: React.PropTypes.array,
  };

  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      formData: {
        name: undefined,
        desc: undefined
      },
      validateStatus: {
        name: false,
        desc: false
      }
    }
  }

  renderForm () {
    const formData = this.state.formData;
    const validateStatus = this.state.validateStatus;
    return (
      <Form horizontal>
        <FormItem
          hasFeedback
          validateStatus={validateStatus.name ? 'error' : ''}
          help='请输入产品端名称'
          label='产品端名称：'
          labelCol={{span: 6}}
          wrapperCol={{span: 14}}>
          <Input
            type='text'
            value={formData.name}
            onChange={this.handleFormChange.bind(this, 'name')}
            placeholder='名称' />
        </FormItem>
        <FormItem
          hasFeedback
          validateStatus={validateStatus.desc ? 'error' : ''}
          help='请输入产品端简介'
          label='产品端简介：'
          labelCol={{span: 6}}
          wrapperCol={{span: 14}}>
          <Input
            type='text'
            value={formData.desc}
            onChange={this.handleFormChange.bind(this, 'desc')}
            placeholder='一句话描述' />
        </FormItem>
      </Form>
    );
  }

  render() {
    const orgId = '1234'
    const list = this.props.list;
    let listSource = list.map(item => {
      return {
        title: item.title,
        handleClick: () => {history.pushState(null, `/${orgId}/settings/product/${item.id}`)}
      }
    })
    listSource.push({
      title: '+添加产品端',
      handleClick: ::this.handleProductNew
    })
    return (
      <div className='product content'>
        <BoxList viewer={4} list={listSource} />
        <Modal
          title='添加产品端'
          visible={this.state.showModal}
          onOk={::this.handleModalEnsure}
          onCancel={::this.handleModalCancel}
          okText='确定'
          cancelText='取消'>
          {this.renderForm()}
        </Modal>
      </div>
    );
  }

  // handle directory changes
  handleProductNew() {
    const defaultFormData = {
      name: undefined,
      desc: undefined
    };
    const validateStatus = {
      name: false,
      desc: false
    };
    this.setState({
      showModal: true,
      formData: defaultFormData,
      validateStatus: validateStatus
    })
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

  // handle modal state
  handleModalEnsure() {
    let passValidate = true;
    const newValidateStatus = Object.assign({}, this.state.validateStatus);
    const items = Object.keys(newValidateStatus);
    const formData = this.state.formData;
    items.forEach(item => {
      const itemValue = formData[`${item}`];
      // validate is empty or not
      if (itemValue) {
        newValidateStatus[`${item}`] = false;
      } else {
        newValidateStatus[`${item}`] = true;
        passValidate = false;
      }
    });
    if (passValidate) {
       // do actions
       console.log('submit', formData);
       this.setState({
        showModal: false,
        validateStatus: newValidateStatus
      });
    } else {
      this.setState({
        validateStatus: newValidateStatus
      });
    }
  }

  handleModalCancel() {
    this.setState({
      showModal: false
    })
  }
}
