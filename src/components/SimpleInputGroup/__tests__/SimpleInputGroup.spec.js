import React from 'react';
import ReactDOM from 'react-dom';
import { Simulate } from 'react-addons-test-utils';
import { renderComponent, mockFetch } from '#/utils/testHelper';

import SimpleInputGroup from '../SimpleInputGroup';

describe('SimpleInputGroup', () => {
  let simpleInputGroup, mock, formConfigs;

  beforeEach(() => {
    mock = {
      handleClick: function () {}
    };
    spyOn(mock, 'handleClick');

    const orgData = {
      orgName: 'test org',
      orgDesc: 'I am a test org'
    }

    formConfigs = {
      buttons: [
        {
          title: 'TEST',
          type: 'primary',
          validate: true,
          dataTarget: 'orgData',
          onSave: mock.handleClick
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

    simpleInputGroup = renderComponent(
      <SimpleInputGroup
        className='testClass'
        buttons={formConfigs.buttons}
        inputs={formConfigs.inputs} />
    );
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(simpleInputGroup.node.parentNode);
  });

  it('should provide correct props', () => {
    const { buttons, className, inputs } = simpleInputGroup.instance.props;
    expect(buttons).toEqual(formConfigs.buttons);
    expect(className).toBe('testClass');
    expect(inputs).toEqual(formConfigs.inputs);
  });

  it('should init correct states', () => {
    const { formData, validateStatus } = simpleInputGroup.instance.state;
    expect(formData.orgName).toBe('test org');
    expect(formData.orgDesc).toBe('I am a test org');
    expect(validateStatus.orgName).toBe(false);
    expect(validateStatus.orgDesc).toBe(false);
  });

  it('should render one button and two inputs', () => {
    const inputs = simpleInputGroup.node.querySelectorAll('input');
    const buttons = simpleInputGroup.node.querySelectorAll('button');
    expect(inputs.length).toBe(2);
    expect(buttons.length).toBe(1);
  });

  it('should button handleClick be called when click', () => {
    const button = simpleInputGroup.node.querySelector('button');
    Simulate.click(button);
    expect(mock.handleClick).toHaveBeenCalled();
  });

  it('should validate after input something when set button props `validate` as `true`', () => {
    const button = simpleInputGroup.node.querySelector('button');
    const inputs = simpleInputGroup.node.querySelectorAll('input');
    Simulate.change(inputs[0], { target: { value: 'test' } });
    Simulate.change(inputs[1], { target: { value: undefined } });
    Simulate.click(button);
    expect(simpleInputGroup.instance.state.validateStatus.orgName).toBe(false);
    expect(simpleInputGroup.instance.state.validateStatus.orgDesc).toBe(true);
  });
});
