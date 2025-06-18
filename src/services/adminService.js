const { adminQueries } = require("../database/query/admin");
const { ERROR_MESSAGES } = require("../utils/constants");

const createUser = async (payload) => {
  const isNewUser = await adminQueries.createUser(payload);

  if (!isNewUser)
    throw new Error(JSON.stringify(ERROR_MESSAGES.USER.ALREADY_EXISTS));

  return isNewUser;
};

const getAllCalls = async (startDate, endDate) => {
  const reports = await adminQueries.getAllCalls(startDate, endDate);

  return reports;
};

const findAllCallsByUserIdAndType = async (
  userId,
  startDate,
  endDate,
  type
) => {
  const reports = await adminQueries.findAllCallsByUserIdAndType(
    userId,
    startDate,
    endDate,
    type
  );

  return reports;
};

const updateUserByUserEmail = async (payload) => {
  const updated = await adminQueries.updateUserByUserEmail(payload);

  return updated;
};

const getAllUsers = async () => {
  const users = await adminQueries.getAllUsers();

  return users;
};

exports.adminService = {
  createUser,
  updateUserByUserEmail,
  getAllCalls,
  findAllCallsByUserIdAndType,
  getAllUsers,
};
