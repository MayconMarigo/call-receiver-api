module.exports = (sequelize, DataTypes) => {
    const Company = sequelize.define('companies', {
      id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
      },
      name: DataTypes.STRING,
      status: DataTypes.INTEGER,
      logoImage: DataTypes.STRING,
      colorScheme: DataTypes.STRING
    });
  
    Company.associate = (models) => {
      Company.hasMany(models.Credential, { foreignKey: 'companyId' });
      Company.hasMany(models.Agenda, { foreignKey: 'companyId' });
    };
  
    return Company;
  };
  