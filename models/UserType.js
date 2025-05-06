module.exports = (sequelize, DataTypes) => {
    const UserType = sequelize.define('user_types', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      type: DataTypes.STRING
    });
  
    UserType.associate = (models) => {
      UserType.hasMany(models.User, { foreignKey: 'userTypeId' });
    };
  
    return UserType;
  };
  