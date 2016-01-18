import React from 'react';

import SimpleInputGroup from '#/components/SimpleInputGroup/SimpleInputGroup';

export default class Organization extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      formData: {
        orgName: undefined,
        orgDesc: undefined
      }
    };
  }

  render() {
    const { formData } = this.state;
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
          label: '企业名称',
          field: 'orgName',
          value: formData.orgName
        }, {
          label: '企业描述',
          field: 'orgDesc',
          value: formData.orgDesc
        }
      ]
    };
    return (
      <SimpleInputGroup
        className='organization'
        buttons={formConfigs.buttons}
        inputs={formConfigs.inputs} />
    );
  }

  handleSaveClick(data, dataTarget) {
    this.setState({
      formData: data
    });
    console.log('submit', data);
  }
}
