import React from 'react';
import {
  Table
} from 'tapas-ui';
import LibraryFilter from './LibraryFilter';
import styles from './style.less';
import reactMixin from 'react-mixin';
import routerMixin from '#/utils/routerMixin';


export default class External extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true
    }
  }
  componentWillMount() {
    this.setState({
      ...this.state,
      pagination: {
        current: Number(this.getUrlQuery('page') || 1)
      }
    })
    setTimeout(()=>{
      this.setState({
        ...this.state,
        loading: false,
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
      },
      {
        key: '3',
        title: '深陷调查的中信证券宣布：董事长王东明将卸任',
        source: '一财网',
        organization: '澎湃新闻',
        pullTime: '05/14 14:33',
        inputTime: '05/14 14:33'
      },
      {
        key: '4',
        title: '深陷调查的中信证券宣布：董事长王东明将卸任',
        source: '一财网',
        organization: '澎湃新闻',
        pullTime: '05/14 14:33',
        inputTime: '05/14 14:33'
      },
      {
        key: '5',
        title: '深陷调查的中信证券宣布：董事长王东明将卸任',
        source: '一财网',
        organization: '澎湃新闻',
        pullTime: '05/14 14:33',
        inputTime: '05/14 14:33'
      },
      {
        key: '6',
        title: '深陷调查的中信证券宣布：董事长王东明将卸任',
        source: '一财网',
        organization: '澎湃新闻',
        pullTime: '05/14 14:33',
        inputTime: '05/14 14:33'
      },
      {
        key: '7',
        title: '深陷调查的中信证券宣布：董事长王东明将卸任',
        source: '一财网',
        organization: '澎湃新闻',
        pullTime: '05/14 14:33',
        inputTime: '05/14 14:33'
      },
      {
        key: '8',
        title: '深陷调查的中信证券宣布：董事长王东明将卸任',
        source: '一财网',
        organization: '澎湃新闻',
        pullTime: '05/14 14:33',
        inputTime: '05/14 14:33'
      },
      {
        key: '9',
        title: '深陷调查的中信证券宣布：董事长王东明将卸任',
        source: '一财网',
        organization: '澎湃新闻',
        pullTime: '05/14 14:33',
        inputTime: '05/14 14:33'
      },
      {
        key: '10',
        title: '深陷调查的中信证券宣布：董事长王东明将卸任',
        source: '一财网',
        organization: '澎湃新闻',
        pullTime: '05/14 14:33',
        inputTime: '05/14 14:33'
      },
      {
        key: '11',
        title: '深陷调查的中信证券宣布：董事长王东明将卸任',
        source: '一财网',
        organization: '澎湃新闻',
        pullTime: '05/14 14:33',
        inputTime: '05/14 14:33'
      },
      {
        key: '12',
        title: '深陷调查的中信证券宣布：董事长王东明将卸任',
        source: '一财网',
        organization: '澎湃新闻',
        pullTime: '05/14 14:33',
        inputTime: '05/14 14:33'
      },
      {
        key: '13',
        title: '深陷调查的中信证券宣布：董事长王东明将卸任',
        source: '一财网',
        organization: '澎湃新闻',
        pullTime: '05/14 14:33',
        inputTime: '05/14 14:33'
      },

    ];


    const onChange = event => {
      this.addQuery({page: event.current});
      this.setState({
        ...this.state,
        pagination: {
          current: event.current
        }
      })
    };

    return (
      <div className={styles.root}>
        <LibraryFilter time category column source organization />
        <Table loading={this.state.loading} dataSource={dataSource} columns={columns} pagination={this.state.pagination} onChange={onChange}/>
      </div>
    )
  }
}

reactMixin.onClass(External, routerMixin);
