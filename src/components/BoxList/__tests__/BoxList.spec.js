import React from 'react';
import ReactDOM from 'react-dom';
import { Simulate } from 'react-addons-test-utils';
import { renderComponent } from '#/utils/testHelper';

import BoxList from '../BoxList';

describe('BoxList', () => {
  let boxList, mock;

  beforeEach(() => {
    mock = {
      handleClick1: function () {},
      handleClick2: function () {},
    };
    spyOn(mock, 'handleClick1');
    spyOn(mock, 'handleClick2');
  });

  beforeEach(() => {
    const list = [
      {
        title: 'BeatBox',
        desc: 'Cool',
        handleClick: mock.handleClick1
      },
      {
        title: 'Ukulele',
        desc: undefined,
        handleClick: mock.handleClick2
      }
    ];
    boxList = renderComponent(
      <BoxList list={list} viewer={4} />
    );
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(boxList.node.parentNode);
  });

  it('should has class `viewer-4` when mounted', () => {
    expect(boxList.node.classList.contains('viewer-4')).toBeTruthy();
  });

  it('should render 2 box items', () => {
    expect(boxList.node.querySelectorAll('.box').length).toBe(2);
  });

  it('should render items with title and content', () => {
    const { BeatBox, Ukulele } = boxList.instance._refs;
    const BeatBoxNode = ReactDOM.findDOMNode(BeatBox);
    const UkuleleNode = ReactDOM.findDOMNode(Ukulele);

    expect(BeatBoxNode.querySelector('.title').textContent).toBe('BeatBox');
    expect(BeatBoxNode.querySelector('.desc').textContent).toBe('Cool');
    expect(UkuleleNode.querySelector('.title').textContent).toBe('Ukulele');
    expect(UkuleleNode.querySelector('.desc').textContent).toBe('');
  });

  it('should render items clickable', () => {
    const { BeatBox, Ukulele } = boxList.instance._refs;
    Simulate.click(BeatBox);
    Simulate.click(Ukulele);
    expect(mock.handleClick1).toHaveBeenCalled();
    expect(mock.handleClick2).toHaveBeenCalled();
  });
});
