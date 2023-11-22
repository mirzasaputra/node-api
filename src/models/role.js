'use strict';
const {
  Model
} = require('sequelize');
const { v4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Role.hasMany(models.RoleHasPermission, {
        foreignKey: 'roleId',
        as: 'RoleHasPermission'
      })
    }

    async syncPermission(permissions) {
      await sequelize.models.RoleHasPermission.destroy({
        where: {
          roleId: this.getDataValue('id')
        }
      })

      permissions = await sequelize.models.Permission.findAll({ where: { name: permissions } })
      await sequelize.models.RoleHasPermission.bulkCreate(permissions.map(permission => ({
        id: v4(),
        roleId: this.getDataValue('id'),
        permissionId: permission.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      })))
    }
  }

  Role.init({
    id: {
      primaryKey: true,
      type: DataTypes.UUID
    },
    name: DataTypes.STRING,
    guardName: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Role',
  });

  Role.addHook("afterFind", findResult => {
    if(!Array.isArray(findResult)) findResult = [findResult]
    for(const instance of findResult) {
      if(instance?.RoleHasPermission) {
        instance.dataValues.Permission = instance.RoleHasPermission.map(RoleHasPermission => RoleHasPermission.Permission)
  
        delete instance.RoleHasPermission
        delete instance.dataValues.RoleHasPermission
      }
    }
  })
  return Role;
};