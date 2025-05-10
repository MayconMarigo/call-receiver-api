const { ERROR_MESSAGES } = require("../utils/constants");
const { verifyTokenJwt, createTokenJwt } = require("../utils/jwt");

const verifyEncodedToken = async (token) => {
  const verified = verifyTokenJwt(token);

  if (!verified)
    throw new Error(JSON.stringify(ERROR_MESSAGES.TOKEN.INVALID_TOKEN));

  return verified;
};

const createEncodedToken = (data) => createTokenJwt(data);

const extractTokenFromHeaders = (authorization) =>
  authorization?.split("Bearer ")[1];

exports.TokenService = {
  verifyEncodedToken,
  createEncodedToken,
  extractTokenFromHeaders,
};
