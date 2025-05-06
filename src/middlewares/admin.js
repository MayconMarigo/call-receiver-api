const { userQueries } = require("../database/query/user");
const { TokenService } = require("../services/tokenService");
const { ERROR_MESSAGES } = require("../utils/constants");

const isAdmin = async (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = TokenService.extractTokenFromHeaders(authorization);
    const data = TokenService.verifyEncodedToken(
      token,
      process.env.JWT_SECRET_KEY
    );

    const { email } = data;
    const userIsAdmin = await userQueries.findAdminUserByEmail(email);

    if (!userIsAdmin) throw new Error(ERROR_MESSAGES.UNAUTHORIZED);

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).send(error.message);
  }
};

module.exports = {
  isAdmin,
};
