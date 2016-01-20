# Store

Principle: 数据必须是稳定的。

``` json

{
  user: {
    ...information, // 基本信息
  },
  organizations: {
    ...information, // 基本信息
    members, // 成员
  },
  productions: {
    ...information, // 基本信息
    libraries: {
      types,
      type,
      data,
    },
    drafts: {
      types,
      type,
      data,
    },
    distributions: {
      types,
      type,
      data,
    },
  }
}

```

