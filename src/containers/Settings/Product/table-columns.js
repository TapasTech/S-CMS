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

const mapTypeZh = (name) => {
  const map = {
    'String': '文本',
    'Array': '文本数组',
    'Boolean': '布尔'
  };

  return map[name];
}

const mapWidgetZh = (name) => {
  const map = {
    'Text': '文本输入框',
    'Richtext': '富文本编辑器',
    'Tag': '标签',
    'Switch': '开关',
    'Upload': '上传图片'
  };

  return map[name];
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
    dataIndex: 'field_type',
    render: (text) => {
      return <span>{mapTypeZh(text)}</span>;
    }
  },
  {
    title: '是否必填',
    dataIndex: 'required',
    render: (text) => {
      return (
        <span>{ text === 'yes' ? '是' : '否'}</span>
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
    dataIndex: 'widget',
    render: (text) => {
      return <span>{mapWidgetZh(text)}</span>;
    }
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
