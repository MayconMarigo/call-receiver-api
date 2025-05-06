const { userQueries } = require("../database/query/user");

const login = async (email, password) =>
  await userQueries.findUserByEmailAndPassword(email, password);

exports.UserService = {
  login,
};
