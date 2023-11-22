'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class UserHasRole extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      UserHasRole.belongsTo(models.User, {
        foreignKey: 'userId',
        as: 'User'
      })

      UserHasRole.belongsTo(models.Role, {
        foreignKey: 'roleId',
        as: 'Role'
      })
    }
  }
  UserHasRole.init({
    id: {
      primaryKey: true,
      type: DataTypes.UUID
    },
    userId: DataTypes.UUID,
    roleId: DataTypes.UUID
  }, {
    sequelize,
    modelName: 'UserHasRole',
  });
  return UserHasRole;
};