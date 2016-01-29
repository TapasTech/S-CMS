import React from 'react';
import { connect } from 'react-redux';
import { Form, Input, Button, Spin } from 'tapas-ui';

import * as actionsForPros from '#/actions/productions';
import SimpleInputGroup from '#/components/SimpleInputGroup/SimpleInputGroup';

import './style.less';

const FormItem = Form.Item;

class ProductInfo extends React.Component {

  static propTypes = {
    product: React.PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        name: undefined,
        desc: undefined
      }
    };
  }

  render() {
    const { product } = this.props;
    if (product) {
      const formConfigs = {
        buttons: [
          {
            title: '保存',
            type: 'primary',
            validate: true,
            dataTarget: 'formData',
            onSave: ::this.handleSaveClick
          }
        ],
        inputs: [
          {
            label: '产品端名称',
            field: 'name',
            value: product.name
          }, {
            label: '产品端介绍',
            field: 'desc',
            value: product.description
          }
        ]
      };

      return <SimpleInputGroup
        className='product-info'
        buttons={formConfigs.buttons}
        inputs={formConfigs.inputs} />;
    } else {
      return (
        <div className='product-info'>
          <Spin size='small' />
        </div>
      );
    }
  }

  handleSaveClick(data, dataTarget) {
    this.setState({
      formData: data
    }, () => {
      const { name, desc } = this.state.formData;
      this.props.dispatch(actionsForPros.update({
        orgId: this.props.org.id,
        id: this.props.product.id,
        name: name,
        description: desc
      }));
    });
  }
}

export default connect(state => ({
  org: state.organizations.datum
}))(ProductInfo);
