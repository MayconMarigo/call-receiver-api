const { User, UserType } = require("../../../models");
const { userUtils } = require("../../utils/user");

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
    attributes: ["id", "name", "email", "secret2fa", "userTypeId"],
  });

  if (!data) return null;

  const { dataValues } = data;

  const user = {
    ...dataValues,
    type: userUtils.checkUserType(dataValues.userTypeId),
  };
  delete user.userTypeId;

  return user;
};

const findUserById = async (userId) => {
  const data = await User.findOne({
    where: { id: userId, status: 1 },
    attributes: ["password"],
  });

  if (!data) return null;

  const { password } = data?.dataValues;

  return password;
};

const getUserDataById = async (userId) => {
  const data = await User.findOne({
    where: { id: userId, status: 1 },
    attributes: ["id", "name", "email", "phone", "logoImage", "colorScheme"],
    include: {
      model: UserType,
      required: true,
      attributes: ["type"],
    },
  });

  if (!data) return null;

  const { type } = data?.user_type;

  const { dataValues } = data;

  dataValues.type = type;
  delete dataValues.user_type;

  if (dataValues.logoImage) {
    const base64Image = dataValues.logoImage.toString("base64");
    const dataUrl = `data:image/png;base64,${base64Image}`;

    dataValues.logoImage = dataUrl;
  }

  return dataValues;
};

const findUserTypeById = async (userId) => {
  const data = await User.findOne({
    where: { id: userId, status: 1 },
    attributes: ["userTypeId"],
  });

  if (!data) return null;

  const { userTypeId } = data?.dataValues;

  return userTypeId;
};

exports.userQueries = {
  findAdminUserByEmail,
  findUserByEmailAndPassword,
  findUserById,
  getUserDataById,
  findUserTypeById
};
