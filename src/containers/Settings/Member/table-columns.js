import React from 'react';
import { Icon, Popconfirm } from 'tapas-ui';

import Avatar from '#/components/Avatar/Avatar';

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

export const userListColumns = [
  {
    title: '用户',
    dataIndex: 'name',
    render: function(text, record, index) {
      return (
        <Avatar name={record.name} role={record.role} showRole={true}></Avatar>
      );
    }
  },
  {
    title: '邮箱',
    dataIndex: 'email'
  },
  {
    title: '操作',
    key: 'operation',
    render: function(text, record, index) {
      return (
        record.permission
        ? <span>
            <span href='#' onClick={record.onEdit.bind(this, record)}><Icon type='edit' />编辑</span>
            <span className='ant-divider'></span>
            <Popconfirm
              title='确定删除该字段吗?'
              onConfirm={record.onDelete.bind(this, record.id)}>
              <span><Icon type='delete' />删除</span>
            </Popconfirm>
          </span>
        : <span></span> // can't be `undefined`, avoid the bind wrong
      );
    }
  }
];
