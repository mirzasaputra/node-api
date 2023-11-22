'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class RoleHasPermission extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      RoleHasPermission.belongsTo(models.Role, {
        foreignKey: 'roleId',
        as: 'Role'
      })

      RoleHasPermission.belongsTo(models.Permission, {
        foreignKey: 'permissionId',
        as: 'Permission'
      })
    }
  }
  RoleHasPermission.init({
    id: {
      primaryKey: true,
      type: DataTypes.UUID
    },
    roleId: DataTypes.UUID,
    permissionId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'RoleHasPermission',
  });
  return RoleHasPermission;
};