const { User, UserType } = require("../../../models");

const findAdminUserByEmail = async (email) => {
  const data = await User.findOne({
    where: {
      email,
      status: 1,
    },
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
    attributes: ["id", "name", "email", "secret2fa"],
  });

  if (!data) return null;

  const { dataValues } = data;

  return dataValues;
};

const findUserById = async (userId) => {
  console.log(userId);
  const data = await User.findOne({
    where: { id: userId },
    attributes: ["password"],
  });

  if (!data) return null;

  const { password } = data?.dataValues;

  return password;
};

exports.userQueries = {
  findAdminUserByEmail,
  findUserByEmailAndPassword,
  findUserById,
};
