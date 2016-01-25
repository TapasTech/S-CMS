import React, {PropTypes} from 'react';
import {DatePicker, Select} from 'tapas-ui';
import reactMixin from 'react-mixin';
import routerMixin from '#/utils/routerMixin';
import {pushState} from 'redux-router';
import {connect} from 'react-redux';
import {flux} from '#/reducers';

const RangePicker = DatePicker.RangePicker;
const Option = Select.Option;

class LibraryFilter extends React.Component {
  constructor (props) {
    super(props);
  }
  componentDidMount() {
    if(this.props.productFilter) this.props.dispatch(flux.actionCreators.products.list());
    if(this.props.dynamicFieldConfigFilter) this.props.dispatch(flux.actionCreators.dynamicFieldConfigs.list());
  }
  getName(list, id) {
    if(id === undefined) return list[0].name;
    if(list.length === 1) return list[0].name;
    return list.find(item => item.id === id).name;
  }
  timeFilter() {
    return (
      <RangePicker
        key='time'
        value={[
          this.getUrlQuery('start_at') && new Date(Number(this.getUrlQuery('start_at') * 1000)),
          this.getUrlQuery('end_at') && new Date(Number(this.getUrlQuery('end_at') * 1000))
        ]}
        format="yyyy年M月d日"
        onChange={value => this.addQuery({'start_at': Math.floor(value[0].getTime() / 1000), 'end_at': Math.floor(value[1].getTime() / 1000)})}
      />
    )
  }
  productFilter() {
    const filterProducts = [{name: '全部产品端', id:'all'}, ...(this.props.filterProducts.data || [])];
    return (
      <Select
        key="products"
        dropdownMatchSelectWidth={false}
        value={this.props.filterProducts['@status'] === 'pending' ? '加载中...' : this.getName(filterProducts, this.getUrlQuery('product_id'))}
        onChange={value => value === 'all' ? this.removeQuery('product_id'): this.addQuery({'product_id': value})}>
        {
          filterProducts.map(product => (
            <Option key={product.id} value={product.id}>{product.name}</Option>
          ))
        }
      </Select>
    )
  }
  dynamicFieldConfigFilter() {
    const filterDynamicFieldConfigs = [{name: '全部类型', id:'all'}, ...(this.props.filterDynamicFieldConfigs.data || [])];
    return (
      <Select
        key="dynamicFieldConfigs"
        dropdownMatchSelectWidth={false}
        value={this.props.filterDynamicFieldConfigs['@status'] === 'pending' ? '加载中...' : this.getName(filterDynamicFieldConfigs, this.getUrlQuery('dynamic_field_config_id'))}
        onChange={value => value === 'all' ? this.removeQuery('dynamic_field_config_id') : this.addQuery({'dynamic_field_config_id': value})}>
        {
          filterDynamicFieldConfigs.map(dynamicFieldConfig => (
            <Option key={dynamicFieldConfig.id} value={dynamicFieldConfig.id}>{dynamicFieldConfig.name}</Option>
          ))
        }
      </Select>
    )
  }
  render () {
    let children = [];
    const self = this;
    Object.keys(this.props).forEach(key => {
      return key !== 'dispatch' && self[key] && children.push(self[key]());
    })

    return (
      <div>
        {children}
      </div>
    )
  }
}

reactMixin.onClass(LibraryFilter, routerMixin);

export default connect(state => ({
  filterProducts: state.products_collection,
  filterDynamicFieldConfigs: state.dynamicFieldConfigs_collection,
}))(LibraryFilter);
