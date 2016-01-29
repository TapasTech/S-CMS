import React from 'react';
import ReactDOM from 'react-dom';
import {
  renderConnectComponent,
  mockFetch,
} from '#/utils/testHelper';

import {Provider} from 'react-redux';
import store from '#/store';

import Avatar from '../Avatar';

function avatarMaker(showRole, showEmail, role = 'admin') {
  class AvatarProvider extends React.Component {
    render() {
      return (
        <Provider store={store}>
          <Avatar
            ref="main"
            showRole={showRole}
            showEmail={showEmail}
            name='Seven'
            role={role}
            email='qq@163.com' />
        </Provider>
      );
    }
  }
  return renderConnectComponent(
    <AvatarProvider />
  );
}

describe('Avatar when admin showRole showEmail', () => {
  let mock;
  let avatar;

  beforeEach(() => {
    mock = {
      fetch: () => Promise.resolve()
    };
    spyOn(mock, 'fetch').and.callThrough();
    mockFetch(mock.fetch);
    // showRole: true showEmail: true
    avatar = new avatarMaker(true, true);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(avatar.node.parentNode);
  });

  it('should launch one request when `componentDidMount`', () => {
    expect(mock.fetch.calls.count()).toBe(1);
    expect(mock.fetch.calls.argsFor(0)[0]).toBe(`/api/user`);
    expect(mock.fetch.calls.argsFor(0)[1].method).toBe(`get`);
  });

  it('should render name', () => {
    expect(avatar.node.querySelector('.name').textContent).toBe('Seven');
  });

  it('should render role(admin) when `showRole` is true', () => {
    expect(avatar.node.querySelector('.role').textContent).toBe('管理员');
  });

  it('should render email when `showEmail` is true', () => {
    expect(avatar.node.querySelector('.email').textContent).toBe('qq@163.com');
  });
});

describe('Avatar when admin show role don\'t show email', () => {
  let avatar;

  beforeEach(() => {
    // showRole: true showEmail: false
    avatar = new avatarMaker(true, false);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(avatar.node.parentNode);
  });

  it('should render role(admin) when `showRole` is true', () => {
    expect(avatar.node.querySelector('.role').textContent).toBe('管理员');
  });

  it('should not render email when `showEmail` is false', () => {
    expect(avatar.node.querySelector('.email')).toBe(null);
  });
});

describe('Avatar when admin don\'t show role show email', () => {
  let avatar;

  beforeEach(() => {
    // showRole:false  showEmail: true
    avatar = new avatarMaker(false, true);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(avatar.node.parentNode);
  });

  it('should render email when `showEmail` is true', () => {
    expect(avatar.node.querySelector('.email').textContent).toBe('qq@163.com');
  });

  it('should not render role when `showRole` is false', () => {
    expect(avatar.node.querySelector('.role')).toBe(null);
  });
});

describe('Avatar: admin don\'t show role don\'t show email', () => {
  let avatar;

  beforeEach(() => {
    // showRole:false  showEmail: false
    avatar = new avatarMaker(false, false);
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(avatar.node.parentNode);
  });

  it('should not render email when `showEmail` is false', () => {
    expect(avatar.node.querySelector('.email')).toBe(null);
  });

  it('should not render role when `showRole` is false', () => {
    expect(avatar.node.querySelector('.role')).toBe(null);
  });
});

describe('Avatar when role is user', () => {
  let avatar;

  beforeEach(() => {
    // showRole:true  showEmail: true
    avatar = new avatarMaker(true, true, 'user');
  });

  afterEach(() => {
    ReactDOM.unmountComponentAtNode(avatar.node.parentNode);
  });

  it('should render role(user) when `showRole` is true', () => {
    expect(avatar.node.querySelector('.role').textContent).toBe('普通用户');
  });
});
