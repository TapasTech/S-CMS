import React from 'react';
import ReactDOM from 'react-dom';
import { renderComponent } from '#/utils/testHelper';

import BoxList from '../BoxList';

describe('BoxList', () => {
  let boxList;
  const handleClick = function () {};
  const handleClick2 = function () {};

  beforeEach(() => {
    const list = [
      {
        title: 'BeatBox',
        desc: 'Cool',
        handleClick: handleClick
      },
      {
        title: 'Ukulele',
        desc: undefined,
        handleClick: handleClick2
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

    expect(BeatBox.props.onClick).toEqual(handleClick);
    expect(Ukulele.props.onClick).toEqual(handleClick2);
  });
});
