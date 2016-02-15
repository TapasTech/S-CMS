import React from 'react';
import ReactDOM from 'react-dom';
import { Simulate } from 'react-addons-test-utils';
import { renderComponent, mockFetch } from '#/utils/testHelper';

import InputMail from '../InputMail';

describe('InputMail', () => {
  let inputMail, mock;

  beforeEach(() => {
    mock = {
      handleChange: function () {}
    };
    spyOn(mock, 'handleChange');

    inputMail = renderComponent(
      <InputMail bubbleValue={mock.handleChange} />
    );
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(inputMail.node.parentNode);
  });

  it('should `bubbleValue` callback called when input changes', () => {
    const input = inputMail.node.querySelector('input');
    Simulate.change(input);
    expect(mock.handleChange).toHaveBeenCalled();
  });

  it('should state options not change when input complete email', () => {
    const input = inputMail.node.querySelector('input');
    Simulate.change(input, { target: { value: 'test@test.com' } });
    expect(inputMail.instance.state.options).toEqual([]);
  });

  it('should state options changes when input incomplete email', () => {
    const input = inputMail.node.querySelector('input');
    Simulate.change(input, { target: { value: 'test' } });
    expect(inputMail.instance.state.options).not.toEqual([]);
  });
})
