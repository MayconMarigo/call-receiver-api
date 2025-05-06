module.exports = (sequelize, DataTypes) => {
    const Logs = sequelize.define('logs', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      callId: DataTypes.STRING,
      videoUrl: DataTypes.STRING,
      connected: DataTypes.BOOLEAN,
      startTime: DataTypes.DATE,
      endTime: DataTypes.DATE
    });
  
    Logs.associate = (models) => {
      Logs.belongsTo(models.User, { as: 'Caller', foreignKey: 'callerId' });
      Logs.belongsTo(models.User, { as: 'Receiver', foreignKey: 'receiverId' });
    };
  
    return Logs;
  };
  