const { Sequelize, DataTypes } = require("sequelize");
require('dotenv').config();

const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: "localhost",
    dialect: "mysql",
    logging: false,
  }
);

const User = require("./User")(sequelize, DataTypes);
const UserType = require("./UserType")(sequelize, DataTypes);
const Company = require("./Company")(sequelize, DataTypes);
const Credential = require("./Credential")(sequelize, DataTypes);
const Log = require("./Logs")(sequelize, DataTypes);
const Agenda = require("./Agenda")(sequelize, DataTypes);

const db = {
  sequelize,
  Sequelize,
  User,
  UserType,
  Company,
  Credential,
  Log,
  Agenda,
};

Object.values(db).forEach((model) => {
  if (model.associate) {
    model.associate(db);
  }
});

module.exports = db;
