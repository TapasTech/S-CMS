import React from 'react';
import ReactDOM from 'react-dom';
import { renderComponent } from '#/utils/testHelper';

import Header from '../Header';

describe('Header', () => {
  let header;

  beforeEach(() => {
    header = renderComponent(
      <Header />
    );
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(header.node.parentNode);
  });

  it('should provide correct props to `Dropdown`', () => {
    const dropdown = header.instance.refs.dropdown;
    const { overlay, trigger } = dropdown;
    expect(overlay).toBe('menu');
    expect(trigger).toBe(['click']);
  });

  it('should dropdown contain `Avatar`', () => {
    const dropdown = header.instance.refs.dropdown;
  });
});