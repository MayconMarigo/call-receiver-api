const { adminQueries } = require("../database/query/admin");
const { ERROR_MESSAGES } = require("../utils/constants");

const createUser = async (payload) => {
  const isNewUser = await adminQueries.createUser(payload);

  if (!isNewUser)
    throw new Error(
      JSON.stringify({
        code: ERROR_MESSAGES.USER.ALREADY_EXISTS.CODE,
        message: ERROR_MESSAGES.USER.ALREADY_EXISTS.MESSAGE,
      })
    );

  return isNewUser;
};

exports.adminService = {
  createUser,
};
