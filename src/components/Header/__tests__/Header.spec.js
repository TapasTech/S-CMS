import React from 'react';
import ReactDOM from 'react-dom';
import { renderComponent } from '#/utils/testHelper';

import Header, {menu} from '../Header';

describe('Header', () => {
  let header;

  beforeEach(() => {
    header = renderComponent(
      <Header>
        <div id="testEl">hello world</div>
      </Header>
    );
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(header.node.parentNode);
  });

  it('should provide correct props to `Dropdown`', () => {
    const dropdown = header.instance.refs.dropdown;
    const { overlay, trigger } = dropdown.props;
    expect(overlay).toEqual(menu);
    expect(trigger).toEqual(['click']);
  });

  it('should render children', () => {
    const dropdown = header.instance.refs.dropdown;
    const testEl = document.querySelector('#testEl');
    expect(header.node.contains(testEl)).toBeTruthy;
  });
});
