module.exports = (sequelize, DataTypes) => {
  const Credential = sequelize.define("credentials", {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
  });

  Credential.associate = (models) => {
    Credential.belongsTo(models.User, { foreignKey: "userId" });
  };

  return Credential;
};
