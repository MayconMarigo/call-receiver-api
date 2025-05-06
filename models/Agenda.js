module.exports = (sequelize, DataTypes) => {
    const Agenda = sequelize.define('agendas', {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true
      },
      callId: DataTypes.STRING,
      videoUrl: DataTypes.STRING,
      scheduledDateTime: DataTypes.DATE
    });
  
    Agenda.associate = (models) => {
      Agenda.belongsTo(models.Company, { foreignKey: 'companyId' });
      Agenda.belongsTo(models.User, { as: 'Caller', foreignKey: 'callerId' });
      Agenda.belongsTo(models.User, { as: 'Receiver', foreignKey: 'receiverId' });
    };
  
    return Agenda;
  };
  