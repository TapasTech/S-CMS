import React from 'react';
import { connect } from 'react-redux';
import { Spin } from 'tapas-ui';

import * as actionsForOrgs from '#/actions/organizations';
import SimpleInputGroup from '#/components/SimpleInputGroup/SimpleInputGroup';

import './style.less';

class Organization extends React.Component {

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
    const org = this.props.org;
    if (org) {
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
            value: org.name
          }, {
            label: '企业描述',
            field: 'orgDesc',
            value: org.description
          }
        ]
      };

      return <SimpleInputGroup
        className='organization'
        buttons={formConfigs.buttons}
        inputs={formConfigs.inputs} />;
    } else {
      return (
        <div className='organization'>
          <Spin size='small' />
        </div>
      );
    }
  }

  handleSaveClick(data, dataTarget) {
    this.setState({
      formData: data
    }, () => {
      const { orgName, orgDesc } = this.state.formData;
      this.props.dispatch(actionsForOrgs.update({
        id: this.props.params.orgId,
        name: orgName,
        description: orgDesc
      }));
    });
  }
}

export default connect(state => ({
  org: state.organizations.datum
}))(Organization)
