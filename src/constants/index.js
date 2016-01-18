export default {
  USER: {
    description: 'user',
    CREATE: 'USER_CREATE',
    SHOW: 'USER_SHOW',
    UPDATE: 'USER_UPDATE',
  },
  AUTH: {
    description: 'authorization',
    CREATE: 'AUTH_CREATE',
  },
  ORG: {
    description: 'organizations',
    INDEX: 'ORG_INDEX',
    CREATE: 'ORG_CREATE',
    SHOW: 'ORG_SHOW',
    UPDATE: 'ORG_UPDATE',
    DESTROY: 'ORG_DESTROY'
  },
  PRO: {
    description: 'productions',
    ALL: 'PRO_ALL',
    INDEX: 'PRO_INDEX',
    CREATE: 'PRO_CREATE',
    SHOW: 'PRO_SHOW',
    UPDATE: 'PRO_UPDATE'
  },
  DRA: {
    description: 'drafts',
    INDEX: 'DRA_INDEX',
    CREATE: 'DRA_CREATE',
    SHOW: 'DRA_SHOW',
    UPDATE: 'DRA_UPDATE',
    DESTROY: 'DRA_DESTROY',
    PUBLISH: 'DRA_PUBLISH'
  },
  DIS: {
    description: 'distributions',
    INDEX: 'DIS_INDEX',
    CREATE: 'DIS_CREATE',
    SHOW: 'DIS_SHOW',
    UPDATE: 'DIS_UPDATE'
  },
  LIB: {
    description: 'libraries',
    INDEX: 'LIB_INDEX',
    CREATE: 'LIB_CREATE',
    SHOW: 'LIB_SHOW',
    UPDATE: 'LIB_UPDATE'
  },
  CFG: {
    description: 'configs',
    DRA: {
      description: 'config_drafts',
      INDEX: 'CFG_DRA_INDEX',
      CREATE: 'CFG_DRA_CREATE',
      SHOW: 'CFG_DRA_SHOW',
      UPDATE: 'CFG_DRA_UPDATE',
      DESTROY: 'CFG_DRA_DESTROY'
    },
    FLD: {
      description: 'config_fields',
      CREATE: 'CFG_FLD_CREATE',
      UPDATE: 'CFG_FLD_UPDATE'
    }
  }
}