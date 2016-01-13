import React, {PropTypes} from 'react';
import {DatePicker, Select} from 'tapas-ui';
import reactMixin from 'react-mixin';
import routerMixin from '#/utils/routerMixin';
import {pushState} from 'redux-router';

const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

export default class LibraryFilter extends React.Component {
  constructor (props) {
    super(props);
  }
  render () {
    const filters = {
      time:
        <RangePicker
          key='time'
          defaultValue={[
            this.getUrlQuery('from') && new Date(Number(this.getUrlQuery('from'))),
            this.getUrlQuery('to') && new Date(Number(this.getUrlQuery('to')))
          ]}
          format="yyyy年M月d日"
          onChange={value => this.addQuery({from: value[0].getTime(), to: value[1].getTime()})}
        />,
      category:
        <Select
          key='category'
          defaultValue={this.getUrlQuery('category') || 'all'}
          onChange={value => this.addQuery({category: value})}>
          <Option value='all'>全部类目</Option>
          <Option value='media'>媒体</Option>
          <Option value='electrical'>电子报</Option>
          <Option value='goverment'>政府</Option>
        </Select>,
      column:
        <Select
          key='column'
          defaultValue={this.getUrlQuery('column') || 'all'}
          onChange={value => this.addQuery({column: value})}>
          <Option value='all'>全部栏目</Option>
          <Option value='yaowen'>要闻</Option>
          <Option value='hushen'>沪深</Option>
          <Option value='meigu'>美股</Option>
          <Option value='ganggu'>港股</Option>
        </Select>,
      source:
        <Select
          key='source'
          defaultValue={this.getUrlQuery('source') || 'all'}
          onChange={value => this.addQuery({source: value})}>
          <Option value='all'>全部来源</Option>
          <Option value='xinlangcaijing'>新浪财经</Option>
          <Option value='yicaiwang'>一财网</Option>
          <Option value='diyicaijingxingwenshe'>第一财经新闻社</Option>
        </Select>,
      organization:
        <Select
          key='organization'
          defaultValue={this.getUrlQuery('organization') || 'all'}
          onChange={value => this.addQuery({organization: value})}>
          <Option value='all'>全部撰写机构</Option>
          <Option value='yicai'>一财</Option>
        </Select>,
      platform:
        <Select
          key='platform'
          defaultValue={this.getUrlQuery('platform') || 'all'}
          onChange={value => this.addQuery({platform: value})}>
          <Option value='all'>全部产品端</Option>
          <Option value='ios'>iOS</Option>
        </Select>
    };

    let children = [];
    Object.keys(this.props).forEach(key => filters[key] && children.push(filters[key]));

    return (
      <div>
        {children}
      </div>
    )
  }
}

reactMixin.onClass(LibraryFilter, routerMixin);
