const { User, UserType } = require("../../../models");
const { ACTIVE_USER_STATUS } = require("../../utils/constants");
const { pool, sequelize } = require("../database");

const findAdminUserByEmail = async (email) => {
  const data = await User.findOne({
    where: { email, status: 1 },
    include: {
      model: UserType,
      required: true,
      attributes: ["type"],
    },
    attributes: [],
  });

  if (!data) return null;

  const { type } = data?.user_type;

  return type == "admin";
};

const findUserByEmailAndPassword = async (email, password) => {
  const data = await User.findOne({
    where: { email, password, status: 1 },
  });

  if (!data) return null;

  const { dataValues } = data;

  return dataValues;
};

exports.userQueries = {
  findAdminUserByEmail,
  findUserByEmailAndPassword,
};
