import React from 'react';
import { Icon, Popconfirm } from 'tapas-ui';

const OpeateBtn = (record, onConfirm) => {
  return (
    <span>
      <span href='#' onClick={record.onEdit.bind(this, record)}><Icon type='edit' />编辑</span>
      <span className='ant-divider'></span>
      <Popconfirm
        title='确定删除该字段吗?'
        onConfirm={onConfirm}>
        <span><Icon type='delete' />删除</span>
      </Popconfirm>
    </span>
  );
}

export const fieldsTypeColumns = [
  {
    title: '字段中文名',
    dataIndex: 'name_zh'
  },
  {
    title: '映射名',
    dataIndex: 'name_map'
  },
  {
    title: '字段类型',
    dataIndex: 'field_type'
  },
  {
    title: '是否必填',
    dataIndex: 'required',
    render: (text) => {
      return (
        <span>{ text ? '是' : '否'}</span>
      );
    }
  },
  {
    title: '默认值',
    dataIndex: 'default_value',
    render: (text) => {
      return (
        <span>{ text ? text : '无'}</span>
      );
    }
  },
  {
    title: '控件',
    dataIndex: 'widget'
  },
  {
    title: '操作',
    key: 'operation',
    render: function(text, record, index) {
      return (
        record.editable
        ? <span>
            <span href='#' onClick={record.onEdit.bind(this, record)}><Icon type='edit' />编辑</span>
            {
              /*
              <span className='ant-divider'></span>
              <Popconfirm
                title='确定删除该字段吗?'
                onConfirm={record.onDelete.bind(this, record.id)}>
                <span><Icon type='delete' />删除</span>
              </Popconfirm>
               */
            }
          </span>
        : <span></span> // can't be `undefined`, avoid the bind wrong
      );
    }
  }
];

export const directoryColumns = [
  {
    title: '目录中文名',
    dataIndex: 'name_zh',
    render: function(text) {
      return <span><Icon type='folder' />{text}</span>;
    }
  },
  {
    title: '目录映射名',
    dataIndex: 'name_map'
  },
  {
    title: '操作',
    key: 'operation',
    render: function(text, record, index) {
      return (
        record.editable
        ? <span>
            <span href='#' onClick={record.onEdit.bind(this, record)}><Icon type='edit' />编辑</span>
            {
              /*
                <span className='ant-divider'></span>
                <Popconfirm
                  title='确定删除该字段吗?'
                  onConfirm={record.onDelete.bind(this, record.id)}>
                  <span><Icon type='delete' />删除</span>
                </Popconfirm>
               */
            }
          </span>
        : <span></span> // can't be `undefined`, avoid the bind wrong
      );
    }
  }
];
