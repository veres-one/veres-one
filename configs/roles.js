/*!
 * Copyright (c) 2017-2018 Digital Bazaar, Inc. All rights reserved.
 */
'use strict';

const config = require('bedrock').config;

require('./permissions');

const {permissions, roles} = config.permission;

roles['identity.admin'] = {
  id: 'identity.administrator',
  label: 'Identity Administrator',
  comment: 'Role for identity administrators.',
  sysPermission: [
    permissions.IDENTITY_ADMIN.id,
    permissions.IDENTITY_ACCESS.id,
    permissions.IDENTITY_INSERT.id,
    permissions.IDENTITY_EDIT.id,
    permissions.IDENTITY_REMOVE.id,
    permissions.PUBLIC_KEY_CREATE.id,
    permissions.PUBLIC_KEY_ACCESS.id,
    permissions.PUBLIC_KEY_EDIT.id,
    permissions.PUBLIC_KEY_REMOVE.id
  ]
};
roles['identity.manager'] = {
  id: 'identity.manager',
  label: 'Identity Manager',
  comment: 'Role for identity managers.',
  sysPermission: [
    permissions.IDENTITY_ADMIN.id,
    permissions.IDENTITY_ACCESS.id,
    permissions.IDENTITY_INSERT.id,
    permissions.IDENTITY_EDIT.id,
    permissions.IDENTITY_UPDATE_MEMBERSHIP.id,
    permissions.IDENTITY_CAPABILITY_DELEGATE.id,
    permissions.PUBLIC_KEY_CREATE.id,
    permissions.PUBLIC_KEY_ACCESS.id,
    permissions.PUBLIC_KEY_EDIT.id,
    permissions.PUBLIC_KEY_REMOVE.id
  ]
};

// admin role contains all permissions
roles['admin'] = {
  id: 'admin',
  label: 'Administrator',
  comment: 'Role for System Administrator.',
  sysPermission: [].concat(roles['identity.admin'].sysPermission)
};

// veres admin role
roles['veres.admin'] = {
  id: 'veres.admin',
  label: 'Veres Administrator',
  comment: 'Role for Veres administrators.',
  sysPermission: [
    permissions.LEDGER_NODE_ACCESS.id,
    permissions.LEDGER_NODE_CREATE.id,
    permissions.LEDGER_NODE_REMOVE.id,
    permissions.LEDGER_AGENT_ACCESS.id,
    permissions.LEDGER_AGENT_CREATE.id,
    permissions.LEDGER_AGENT_REMOVE.id
  ].concat(roles['identity.admin'].sysPermission)
};

// default registered identity role (contains all permissions for a regular
// identity)
roles['identity.registered'] = {
  id: 'identity.registered',
  label: 'Registered Identity',
  comment: 'Role for registered identities.',
  sysPermission: [].concat(
    roles['identity.manager'].sysPermission,
    [
      // TODO:
    ]
  )
};
