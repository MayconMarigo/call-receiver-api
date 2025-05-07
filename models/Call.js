module.exports = (sequelize, DataTypes) => {
  const Calls = sequelize.define("calls", {
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
    videoUrl: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    connected: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
    startTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    endTime: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  });

  Calls.associate = (models) => {
    Calls.belongsTo(models.User, { as: "Caller", foreignKey: "callerId" });
    Calls.belongsTo(models.User, { as: "Receiver", foreignKey: "receiverId" });
  };

  return Calls;
};
