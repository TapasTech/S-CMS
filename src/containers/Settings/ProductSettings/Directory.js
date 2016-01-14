import React from 'react';
import { Button, Table } from 'tapas-ui';

import { directoryColumns } from './table-columns';

export default class ProductDirectory extends React.Component {
  static propTypes = {
    name: React.PropTypes.string,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const data = [{
      id: '12',
      key: '1',
      name_zh: '编辑精选',
      name_en: 'editors_choice'
    }, {
      id: '13',
      key: '2',
      name_zh: '千人千面',
      name_en: 'recommendation'
    }, {
      id: '14',
      key: '3',
      name_zh: '热门新闻',
      name_en: 'hot_news'
    }];

    const pagination = {
      total: data.length,
      current: 1,
      onShowSizeChange: function(current, pageSize) {
        console.log('Current: ', current, '; PageSize: ', pageSize);
      }
    };

    return (
      <div className='directory'>
        <div className='heading'>
          <div className='title'>目录</div>
          <Button type='primary'>+ 添加目录</Button>
        </div>
        <Table columns={directoryColumns} dataSource={data} pagination={pagination} />
      </div>
    );
  }
}
