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
        orgData: {
          orgName: undefined,
          orgDesc: undefined
        },
        contactInfo: {
          contact: undefined,
          phone: undefined
        }
      }
    }
  }

  renderSwitchView(step) {
    switch(step) {
      case 1:
        const { contactInfo } = this.state.formData;
        const formConfigs2 = {
          buttons: [
            {
              title: '上一步',
              type: 'ghost',
              validate: false,
              dataTarget: 'contactInfo',
              onSave: ::this.handlePrevClick
            },
            {
              title: '创建企业',
              type: 'primary',
              validate: true,
              dataTarget: 'contactInfo',
              onSave: ::this.handleNextClick
            }
          ],
          inputs: [
            {
              label: '联系人',
              field: 'contact',
              value: contactInfo.contact
            }, {
              label: '手机号',
              field: 'phone',
              value: contactInfo.phone
            }
          ]
        };
        return (
          <SimpleInputGroup
            key='1'
            className='org-info right'
            buttons={formConfigs2.buttons}
            inputs={formConfigs2.inputs} />
        );
        break;
      case 2:
        return <AddMember key='2' />;
        break;
      default:
        const { orgData } = this.state.formData;
        const formConfigs = {
          buttons: [
            {
              title: '下一步',
              type: 'primary',
              validate: true,
              dataTarget: 'orgData',
              onSave: ::this.handleNextClick
            }
          ],
          inputs: [
            {
              label: '企业名称',
              field: 'orgName',
              value: orgData.orgName
            }, {
              label: '企业描述',
              field: 'orgDesc',
              value: orgData.orgDesc
            }
          ]
        };
        return (
          <SimpleInputGroup
            key='0'
            className='org-info right'
            buttons={formConfigs.buttons}
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

  handleStepClick(data, dataTarget, stepNum) {
    let prevStep = this.state.step + stepNum;
    let newFormData = Object.assign({}, this.state.formData);
    newFormData[`${dataTarget}`] = data;
    this.setState({
      step: prevStep,
      formData: newFormData
    });
  }

  handlePrevClick(data, dataTarget) {
    let prevStep = this.state.step - 1;
    let newFormData = Object.assign({}, this.state.formData);
    newFormData[`${dataTarget}`] = data;
    this.setState({
      step: prevStep,
      formData: newFormData
    });
  }

  handleNextClick(data, dataTarget) {
    let nextStep = this.state.step + 1;
    let newFormData = Object.assign({}, this.state.formData);
    newFormData[`${dataTarget}`] = data;
    this.setState({
      step: nextStep,
      formData: newFormData
    });
  }
}
