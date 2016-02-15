import React from 'react';
import ReactDOM from 'react-dom';
import { renderComponent } from '#/utils/testHelper';

import Avatar from '../Avatar';

describe('Avatar when admin', () => {
  let avatar;

  beforeEach(() => {
    avatar = renderComponent(
      <Avatar
        name='Seven'
        role='admin'
        email='super@root.com' />
    );
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(avatar.node.parentNode);
  });

  it('should render name, role and email', () => {
    expect(avatar.node.querySelector('.name').textContent).toBe('Seven');
    expect(avatar.node.querySelector('.role').textContent).toBe('管理员');
    expect(avatar.node.querySelector('.email').textContent).toBe('super@root.com');
  });
});
