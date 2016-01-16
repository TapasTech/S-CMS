import React from 'react';
import { Steps, Button } from 'tapas-ui';

import SimpleInputGroup from '#/components/SimpleInputGroup/SimpleInputGroup';
import Header from '#/components/Header/Header';
import AddMember from './AddMember';

import './style.less';

const Step = Steps.Step;

const createSteps = [
  {
    title: '完善企业信息',
    description: '完善企业信息'
  }, {
    title: '填写联系人信息',
    description: '这里是多信息的耶哦耶哦哦耶哦耶'
  }, {
    title: '添加企业成员',
    description: '描述啊描述啊'
  }
];

export default class CreateOrg extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      formData: {
        orgData: undefined,
        contactInfo: undefined
      }
    }
  }

  renderSwitchView(step) {
    switch(step) {
      case 1:
        const formConfigs2 = {
          saveButton: {
            position: 'right',
            title: '创建企业',
            type: 'primary',
            data: 'contactInfo',
            onSave: ::this.handleNextClick
          },
          inputs: [
            {
              label: '联系人',
              field: 'contact'
            }, {
              label: '手机号',
              field: 'phone'
            }
          ]
        };
        return (
          <SimpleInputGroup
            key='1'
            className='org-info'
            saveButton={formConfigs2.saveButton}
            inputs={formConfigs2.inputs}>
            <Button
              style={{width: 150, marginTop: 15}}
              size='large'
              onClick={::this.handlePrevClick}>上一步</Button>
          </SimpleInputGroup>
        );
        break;
      case 2:
        return <AddMember key='2' />;
        break;
      default:
        const formConfigs = {
          saveButton: {
            position: 'right',
            title: '保存',
            type: 'primary',
            data: 'orgData',
            onSave: ::this.handleNextClick
          },
          inputs: [
            {
              label: '企业名称',
              field: 'orgName'
            }, {
              label: '企业描述',
              field: 'orgDesc'
            }
          ]
        };
        return (
          <SimpleInputGroup
            key='0'
            className='org-info'
            saveButton={formConfigs.saveButton}
            inputs={formConfigs.inputs} />
        );
    }
  }

  render() {
    const step = this.state.step;
    return (
      <div className='create-org'>
        <Header title='S-CMS' />
        <div className='content'>
          <div className='title'>注册企业</div>
          <Steps current={step}>
            {
              createSteps.map( (s, i) => {
                return <Step key={i} title={s.title} />
              })
            }
          </Steps>
          <div>
            {this.renderSwitchView(step)}
          </div>
        </div>
      </div>
    );
  }

  handlePrevClick() {
    let prevStep = this.state.step - 1;
    this.setState({
      step: prevStep
    });
  }

  handleNextClick(data, status) {
    let nextStep = this.state.step + 1;
    let newFormData = Object.assign({}, this.state.formData);
    newFormData[`${status}`] = data;
    this.setState({
      step: nextStep,
      formData: newFormData
    });
  }
}
