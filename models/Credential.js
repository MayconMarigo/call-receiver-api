module.exports = (sequelize, DataTypes) => {
    const Credential = sequelize.define('credentials', {
      id: {
        type: DataTypes.STRING,
        primaryKey: true
      }
    });
  
    Credential.associate = (models) => {
      Credential.belongsTo(models.Company, { foreignKey: 'companyId' });
    };
  
    return Credential;
  };
  