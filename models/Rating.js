module.exports = (sequelize, DataTypes) => {
  const Ratings = sequelize.define("ratings", {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false
    },
  });

  Ratings.associate = (models) => {
    Ratings.belongsTo(models.Call, { foreignKey: "callId" });
  };

  return Ratings;
};
