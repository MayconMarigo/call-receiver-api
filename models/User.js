module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('users', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    phone: DataTypes.STRING,
    password: DataTypes.STRING,
    status: DataTypes.INTEGER
  });

  User.associate = (models) => {
    User.belongsTo(models.UserType, { foreignKey: 'userTypeId' });
    User.hasMany(models.Log, { as: 'LogsAsCaller', foreignKey: 'callerId' });
    User.hasMany(models.Log, { as: 'LogsAsReceiver', foreignKey: 'receiverId' });
    User.hasMany(models.Agenda, { as: 'AgendasAsCaller', foreignKey: 'callerId' });
    User.hasMany(models.Agenda, { as: 'AgendasAsReceiver', foreignKey: 'receiverId' });
  };

  return User;
};