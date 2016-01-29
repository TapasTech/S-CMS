import React from 'react';
import { connect } from 'react-redux';
import {
  Button,
  Table,
  Modal,
  Form,
  Input
} from 'tapas-ui';

import * as actionsForPros from '#/actions/productions';

import history from '#/utils/history';
import BoxList from '#/components/BoxList/BoxList';

const FormItem = Form.Item;

class ProductList extends React.Component {

  static propTypes = {
    products: React.PropTypes.array,
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
    };
  }

  componentDidMount() {
    const orgId = this.props.params.orgId;
    this.props.dispatch(actionsForPros.index(orgId));
  }

  renderForm() {
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
    const orgId = this.props.params.orgId;
    const products = this.props.products;
    let listSource = products.map(item => {
      return {
        title: item.name,
        handleClick: () => { history.pushState(null, `/${orgId}/settings/product/${item.id}`); }
      };
    });
    listSource.push({
      title: '+添加产品端',
      handleClick: ::this.handleProductNew
    });
    return (
      <div className='product-list'>
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
    });
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
      const { name, desc } = this.state.formData;
      this.props.dispatch(actionsForPros.create({
        orgId: this.props.params.orgId,
        name: name,
        description: desc
      }));
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
    });
  }
}

export default connect(state => ({
  products: state.productions.data
}))(ProductList);
