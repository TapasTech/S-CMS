import React from 'react';
import ReactDOM from 'react-dom';
import { renderComponent } from '#/utils/testHelper';

import Account from '../Account';

describe('Account', () => {
  let account, contentNode;

  beforeEach(() => {
    const title = 'I am a title';
    account = renderComponent(
      <Account title={title}>
        I am a children
      </Account>
    );
    contentNode = account.node.querySelector('.content');
  });

  it('should render title', () => {
    const titleNode = contentNode.querySelector('.title');
    expect(titleNode.textContent).toBe('I am a title');
  });

  it('should render children', () => {
    const childNode = contentNode.lastElementChild;
    expect(childNode.textContent).toBe('I am a children');
  });
})
