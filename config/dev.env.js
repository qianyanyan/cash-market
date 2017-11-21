var merge = require('webpack-merge')
var prodEnv = require('./prod.env')

module.exports = merge(prodEnv, {
  NODE_ENV: '"development"',
  API_ROOT: '"http://192.168.1.212:8088"',
  IMG_SERVER: '"http://192.168.1.212:8090"',
  port: 8000,
  apis: {

    '/apis/login': '/engine-console/console/sysUser/login.do',
    '/apis/logout': '/engine-console/console/sysUser/logout.do',
    '/apis/toIndex': '/engine-console/console/sysUser/toIndex.do',
    '/apis/selectUser': '/engine-console/console/sysUser/selectUser.do',
    '/apis/modifyUser': '/engine-console/console/sysUser/modifyUser.do',
    '/apis/removeUser': '/engine-console/console/sysUser/deleteSysUserBatch.do',
    '/apis/addUser': '/engine-console/console/sysUser/addSysUser.do',
    '/apis/searchRole': '/engine-console/console/sysRole/searchRole.do',
    '/apis/deleteSysUserRoleBatch': '/engine-console/console/sysUserRole/deleteSysUserRoleBatch.do',
    '/apis/searchMenu': '/engine-console/console/sysMenu/searchMenu.do',
    '/apis/searchFMenu': '/engine-console/console/sysMenu/searchFMenu.do',
    '/apis/modifyMenu': '/engine-console/console/sysMenu/modifyMenu.do',
    '/apis/deleteMenu': '/engine-console/console/sysMenu/falseDeleteMenuBatch.do',
    '/apis/addMenu': '/engine-console/console/sysMenu/addMenu.do',
    '/apis/modifyRole': '/engine-console/console/sysRole/modifyRole.do',
    '/apis/deleteRoleBatch': '/engine-console/console/sysRole/falseDeleteRoleBatch.do',
    '/apis/addRole': '/engine-console/console/sysRole/addRole.do',
    '/apis/searchUserForRole': '/engine-console/console/sysRole/searchUserForRole.do',
    '/apis/addSysUserRoleBatch': '/engine-console/console/sysUserRole/addSysUserRoleBatch.do',
    '/apis/searchPermissions': '/engine-console/console/sysPermissions/searchPerssmition.do',
    '/apis/modifyPermisstion': '/engine-console/console/sysPermissions/modifyPermisstion.do',
    '/apis/searchResources': '/engine-console/console/sysPermissions/searchResources.do',
    '/apis/addResources': '/engine-console/console/sysPermissions/addResources.do',
    '/apis/deleteResources': '/engine-console/console/sysPermissions/falseDeleteResourcesBatch.do',
    '/apis/modifyResources': '/engine-console/console/sysPermissions/modifyResources.do',
    '/apis/uploadPicture': '/engine-console/console/uploadFile/uploadPicture.do',
    '/apis/merchantList': '/engine-console/console/cmarketMerchant/show.do',
    '/apis/addMerchant': '/engine-console/console/cmarketMerchant/add.do',
    '/apis/modifyMerchant': '/engine-console/console/cmarketMerchant/update.do',
    '/apis/searMerchantAd': '/engine-console/console/cmarketMerchantAd/searchCMarketMerchantAd.do',
    '/apis/searchCMarket': '/engine-console/console/cmarketMerchantAd/selectCMarketMerchant.do',
    '/apis/addMerchantAd': '/engine-console/console/cmarketMerchantAd/addCMarketMerchantAd.do',
    '/apis/updatechCMarket': '/engine-console/console/cmarketMerchantAd/updatechCMarketMerchantAd.do',

    '/apis/postTest': '/engine-console/console/sysUser/postTest.do',
    '/apis/getTest': '/engine-console/console/sysUser/getTest.do',
    '/apis/putTest': '/engine-console/console/sysUser/putTest.do',
    '/apis/picTest': '/engine-console/console/sysUser/uploadPicture.do'
  }
})

