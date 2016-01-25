import React from 'react';
import { Form, Input, Button, Row, Col } from 'tapas-ui';

import './style.less';

const FormItem = Form.Item;

/*
 * this component is for simple input group
 * like two inputs and one save button
 * you can use children to insert more buttons
 * plan to extend it as a common form component
*/

export default class SimpleInputGroup extends React.Component {

  static propTypes = {
    buttons: React.PropTypes.array,
    inputs: React.PropTypes.array,
    className: React.PropTypes.string
  };

  constructor(props) {
    super(props);
    const { inputs } = this.props;
    let originData = {};
    let originStatus = {};
    inputs.forEach( item => {
      const {field, value} = item;
      originData[`${field}`] = value;
      originStatus[`${field}`] = false;
    });

    this.state = {
      formData: originData,
      validateStatus: originStatus
    };
  }

  render() {
    const { inputs, buttons, className } = this.props;
    const { formData, validateStatus } = this.state;
    // combine className
    let formClass = 'simple-input-group';
    className && (formClass = formClass.concat(' ' ,`${className}`))
    return (
      <Form horizontal className={formClass}>
        {
          inputs.map( (item, index) => {
            const {field, label} = item;
            return (
              <FormItem
                key={index}
                hasFeedback
                validateStatus={validateStatus[`${field}`] ? 'error' : ''}
                help={`请输入${label}`}
                label={`${label}：`}
                labelCol={{span: 3}}
                wrapperCol={{span: 21}}>
                <Input
                  key={index}
                  type='text'
                  value={formData[`${field}`]}
                  onChange={this.handleFormChange.bind(this, `${field}`)}
                  placeholder={`${label}`} />
              </FormItem>
            );
          })
        }
        <Row>
          <Col span="21" offset="3">
            <div className='buttons'>
              {
                buttons.map( (item, index) => {
                  const { title, type, dataTarget, loading, validate, onSave } = item;
                  return (
                    <Button
                      key={title}
                      style={{width: 150, marginTop: 15}}
                      type={`${type}`}
                      size='large'
                      onClick={this.handleSaveClick.bind(this, onSave, dataTarget, validate)}>{title}</Button>
                  );
                })
              }
            </div>
          </Col>
        </Row>
      </Form>
    );
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

  handleSaveClick(onSave, dataTarget, validate) {
    const formData = this.state.formData;
    if (validate) {
      let passValidate = true;
      const newValidateStatus = Object.assign({}, this.state.validateStatus);
      const items = Object.keys(newValidateStatus);
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
        this.setState({
          validateStatus: newValidateStatus
        });
        // 将表单数据传递至外层
        if (onSave) {
          onSave(formData, dataTarget);
        }
      } else {
        this.setState({
          validateStatus: newValidateStatus
        });
      }
    } else {
       // 将表单数据传递至外层
      if (onSave) {
        onSave(formData, dataTarget);
      }
    }
  }
}
