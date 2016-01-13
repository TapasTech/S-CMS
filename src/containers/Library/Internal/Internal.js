import React from 'react';
import {
  Table
} from 'tapas-ui';
import styles from './style.less';
import LibraryFilter from './LibraryFilter';

export default class Internal extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        loading: true
      }
    }
    componentWillMount() {
      this.store = this.context.store;
      this.getRouter = () => this.store[ROUTER_STATE_SELECTOR](this.store.getState());
      setTimeout(()=>{
        this.setState({
          loading: false
        });
      }, 1000)
    }
    render() {
      const columns = [
        {
          title: '标题',
          dataIndex: 'title',
          key: 'title'
        },
        {
          title: '新闻来源',
          dataIndex: 'source',
          key: 'source',
        },
        {
          title: '撰写机构',
          dataIndex: 'organization',
          key: 'organization'
        },
        {
          title: '抓取时间',
          dataIndex: 'pullTime',
          key: 'pullTime'
        },
        {
          title: '入库时间',
          dataIndex: 'inputTime',
          key: 'inputTime'
        }
      ];

      const dataSource = [
        {
          key: '1',
          title: '出尔反尔的万豪还是收了喜达屋 变身全球酒店老大',
          source: '一财网',
          organization: '一财网',
          pullTime: '05/14 14:40',
          inputTime: '05/14 14:40'
        },
        {
          key: '2',
          title: '深陷调查的中信证券宣布：董事长王东明将卸任',
          source: '一财网',
          organization: '澎湃新闻',
          pullTime: '05/14 14:33',
          inputTime: '05/14 14:33'
        }
      ];
      return (
        <div className={styles.root}>
          <LibraryFilter time platform source organization/>
          <Table loading={this.state.loading} dataSource={dataSource} columns={columns} />
        </div>
      )
    }
}
