module.exports = (sequelize, DataTypes) => {
  const Agenda = sequelize.define("agendas", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    callId: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    callerId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    receiverId: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
    },
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    scheduledDateTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  Agenda.associate = (models) => {
    Agenda.belongsTo(models.User, { as: "Caller", foreignKey: "callerId" });
    Agenda.belongsTo(models.User, { as: "Receiver", foreignKey: "receiverId" });
  };

  return Agenda;
};
