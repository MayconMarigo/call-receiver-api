const { adminQueries } = require("../database/query/admin");
const { ERROR_MESSAGES } = require("../utils/constants");

const createUser = async (payload) => {
  const isNewUser = await adminQueries.createUser(payload);

  if (!isNewUser)
    throw new Error(JSON.stringify(ERROR_MESSAGES.USER.ALREADY_EXISTS));

  return isNewUser;
};

const findAllCalls = async (startDate, endDate) => {
  const reports = await adminQueries.findAllCalls(startDate, endDate);

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

const updateUserByUserId = async (payload) => {
  const updated = await adminQueries.updateUserByUserId(payload);

  return updated;
};

exports.adminService = {
  createUser,
  updateUserByUserId,
  findAllCalls,
  findAllCallsByUserIdAndType,
};
