import _ from 'lodash';
import React from 'react';
import ReactDOM from 'react-dom';
import {
  scryRenderedComponentsWithType,
} from 'react-addons-test-utils';
import {
  renderComponent,
  renderConnectComponent,
  mockFetch,
} from '#/utils/testHelper';

import {Provider} from 'react-redux';
import store from '#/store';
import {
  Jumbotron,
  Navigator,
  SettingContainer,
} from '../SettingContainer';
import {Header} from '#/components';

describe('Navigator', () => {
  let navigator, handleClick;
  const orgId = '12345678';
  beforeEach(() => {
    handleClick = function () {};
    navigator = renderComponent(
      <Navigator
        orgId={orgId}
        current="product"
        handleClick={handleClick}
      />
    );
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(navigator.node.parentNode);
  });

  it('should contains 3 items', () => {
    const list = navigator.node.querySelectorAll('li');
    let items = [];
    _.forEach(list, item => {
      const link = item.querySelector('a');
      items.push({
        href: link.getAttribute('data-href'),
        text: link.textContent
      });
    });
    expect(items.length).toBe(3);
    expect(items[0].text).toBe('产品端配置');
    expect(items[1].text).toBe('企业设置');
    expect(items[2].text).toBe('成员管理');
    expect(items[0].href).toMatch(new RegExp(`\/${orgId}\/settings\/product$`));
    expect(items[1].href).toMatch(new RegExp(`\/${orgId}\/settings\/organization$`));
    expect(items[2].href).toMatch(new RegExp(`\/${orgId}\/settings\/member$`));
  });
  it('should active `product` item defaultly', () => {
    const {product, organization, member} = navigator.instance._refs;
    const productNode = ReactDOM.findDOMNode(product);
    const organizationNode = ReactDOM.findDOMNode(organization);
    const memberNode = ReactDOM.findDOMNode(member);
    expect(productNode.classList.contains('ant-menu-item-selected')).toBeTruthy();
    expect(organizationNode.classList.contains('ant-menu-item-selected')).toBeFalsy();
    expect(memberNode.classList.contains('ant-menu-item-selected')).toBeFalsy();
  });
  it('should provide correct props to `Menu`', () => {
    const Menu = navigator.instance.refs.menu;
    const {mode, selectedKeys, onClick} = Menu.props;
    expect(mode).toBe('horizontal');
    expect(selectedKeys).toEqual(['product']);
    expect(onClick).toEqual(handleClick);
  });
});

describe('SettingContainer', () => {
  let settingContainer, mock;
  const orgId = '123123';
  beforeEach(() => {
    mock = {
      fetch: function () {
        return Promise.resolve();
      }
    };
    spyOn(mock, 'fetch').and.callThrough();
    mockFetch(mock.fetch);
  });
  beforeEach(() => {
    const routes = [
      {path: 'a'},
      {path: 'b'},
      {path: 'product'},
      {path: '1234'}
    ];
    const route = {path: 'b'};
    const params = {orgId};
    class SettingContainerProvider extends React.Component {
      render() {
        return (
          <Provider store={store}>
            <SettingContainer
              ref="main"
              routes={routes}
              route={route}
              params={params}
            >
              hello world
            </SettingContainer>
          </Provider>
        );
      }
    }
    settingContainer = renderConnectComponent(
      <SettingContainerProvider />
    );
  });
  afterEach(() => {
    ReactDOM.unmountComponentAtNode(settingContainer.node.parentNode);
  });
  it('should render children', () => {
    expect(settingContainer.node.lastElementChild.textContent).toBe('hello world');
  });
  it('should launch two requests when `componentDidMount`', () => {
    expect(mock.fetch.calls.count()).toBe(2);
    expect(mock.fetch.calls.argsFor(0)[0]).toBe(`/api/organizations/${orgId}`);
    expect(mock.fetch.calls.argsFor(0)[1].method).toBe(`get`);
    expect(mock.fetch.calls.argsFor(1)[0]).toBe(`/api/user`);
    expect(mock.fetch.calls.argsFor(1)[1].method).toBe(`get`);
  });
  it('should set initial state', () => {
    const expectedState = {
      current: 'product',
    };
    expect(settingContainer.instance.state).toEqual(expectedState);
  });
  describe('handleNavClick', () => {
    it('should change `this.state.current`', () => {
      settingContainer.instance.handleNavClick({key: 'member'});
      expect(settingContainer.instance.state.current).toBe('member');
    });
  });
  it('should contains three child components', () => {
    function findComponent(componentClass) {
      return scryRenderedComponentsWithType(
        settingContainer.instance,
        componentClass
      );
    }
    expect(findComponent(Header).length).toBe(1);
    expect(findComponent(Jumbotron).length).toBe(1);
    expect(findComponent(Navigator).length).toBe(1);
  });
});
