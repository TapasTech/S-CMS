import React, {PropTypes} from 'react';
import ReactDOM from 'react-dom';
import {
  scryRenderedComponentsWithType,
} from 'react-addons-test-utils';
import {
  renderComponent,
  renderConnectComponent,
  mockFetch,
} from '#/utils/testHelper';
import { pushState } from 'redux-router';

import {Provider} from 'react-redux';
import store from '#/store';
import {routerDidChange} from 'redux-router/lib/actionCreators'
import LibraryFilter from '../index';

describe('LibraryFilter', () => {
  store.dispatch(routerDidChange({
    location: {
      pathname: '/5697706f5e98be7954000000/5697784a5e98be7954000002/library/internal',
      search: '',
      hash: '',
      action: 'PUSH',
      query: {}
    },
    params: {
      orgId: '5697706f5e98be7954000000',
      productId: '5697784a5e98be7954000002'
    }
  }));

  it('should render children', () => {
    let libraryFilter;
    class LibraryFilterProvider extends React.Component {
      render() {
        return (
          <Provider store={store}>
            <LibraryFilter
              ref="main"
              timeFilter
              productFilter
              dynamicFieldConfigFilter
            />
          </Provider>
        );
      }
    }
    libraryFilter = renderConnectComponent(
      <LibraryFilterProvider />
    );
    const list = libraryFilter.node.querySelectorAll('span');
    expect(Array.prototype.some.call(list, el => el.getAttribute('data-reactid').includes('time'))).toBe(true);
    expect(Array.prototype.some.call(list, el => el.getAttribute('data-reactid').includes('products'))).toBe(true);
    expect(Array.prototype.some.call(list, el => el.getAttribute('data-reactid').includes('dynamicFieldConfigs'))).toBe(true);
    ReactDOM.unmountComponentAtNode(libraryFilter.node.parentNode);
  });
});
