'use strict';
const {
  Model
} = require('sequelize');
const { v4 } = require('uuid');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      User.hasMany(models.UserHasRole, {
        foreignKey: 'userId',
        as: 'UserHasRole'
      })
    }

    async assignRole(roleName) {
      const role = await sequelize.models.Role.findOne({ where: { name: roleName }})
      const count = await sequelize.models.UserHasRole.count({
        where: { 
          userId: this.getDataValue('id'),
          roleId: role.id
        }
      })

      if(count == 0) {
        await sequelize.models.UserHasRole.create({
          id: v4(),
          userId: this.getDataValue('id'),
          roleId: role.id
        })
      }
    }

    async syncRole(roleName) {
      const role = await sequelize.models.Role.findOne({ where: { name: roleName }})
      await sequelize.models.UserHasRole.destroy({
        where: {
          userId: this.getDataValue('id')
        }
      })

      await sequelize.models.UserHasRole.create({
        id: v4(),
        userId: this.getDataValue('id'),
        roleId: role.id
      })
    }
  }

  User.init({
    id: {
      type: DataTypes.UUID,
      primaryKey: true
    },
    userableType: {
      type: DataTypes.STRING,
      allowNull: true
    },
    userableId: {
      type: DataTypes.UUID,
      allowNull: true
    },
    name: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    emailVerifiedAt: {
      type: DataTypes.STRING,
      allowNull: true
    },
    password: DataTypes.STRING,
    isActive: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'User',
  });

  User.addHook("afterFind", findResult => {
    if(!Array.isArray(findResult)) findResult = [findResult]
    for(const instance of findResult) {
      if(instance?.UserHasRole) {
        instance.Roles = instance.UserHasRole.map(UserHasRole => UserHasRole.Role)
        instance.dataValues.Roles = instance.UserHasRole.map(UserHasRole => UserHasRole.Role)
  
        delete instance.UserHasRole
        delete instance.dataValues.UserHasRole

        for(const permissionInstance of instance.dataValues.Roles) {
          if(permissionInstance?.RoleHasPermission) {
            permissionInstance.Permission = permissionInstance.RoleHasPermission.map(RoleHasPermission => RoleHasPermission.Permission)
            permissionInstance.dataValues.Permission = permissionInstance.RoleHasPermission.map(RoleHasPermission => RoleHasPermission.Permission)
  
            delete permissionInstance.RoleHasPermission
            delete permissionInstance.dataValues.RoleHasPermission
          }
        }
      }
    }
  })

  return User;
};