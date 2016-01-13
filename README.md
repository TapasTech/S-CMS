# S-CMS
## The super content management system. 

### CLI

``` shell
# develop
npm start
# export
npm run build
```

### Route

``` shell
# 登录注册
/login
/register

# 欢迎页
/dashboard

# 组织设置
/:orgId/settings（管理员配置）

# 产品端
/:orgId/:productId/library（内容库）
/:orgId/:productId/draft（内容生产）
/:orgId/:productId/distribution（内容分发）

/:orgId/:productId/draft/:draftTypeId/new（新建文章）
/:orgId/:productId/draft/:draftTypeId/:draftId（已入草稿箱的文章）

/:orgId/:productId/distribution/:blockId（内容分发的渠道）
```

### Structure

``` shell
├── CHANGELOG.md
├── README.md
├── package.json
└── src
    ├── actions
    ├── components
    ├── constants
    ├── containers
    │   ├── Dashboard
    │   ├── DevTools
    │   ├── Distribution
    │   │   ├── Block
    │   ├── Draft
    │   │   ├── Editor
    │   │   ├── List
    │   ├── Library
    │   │   ├── External
    │   │   ├── Internal
    │   ├── Login
    │   ├── Overcoat
    │   ├── Register
    │   ├── Root
    │   └── Settings
    ├── index.html
    ├── index.js
    ├── router.js
    ├── reducers
    ├── store
    └── utils
```