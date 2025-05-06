const { verifyTokenJwt, createTokenJwt } = require("../utils/jwt");

const verifyEncodedToken = (token) => verifyTokenJwt(token);

const createEncodedToken = (data) => createTokenJwt(data)

const extractTokenFromHeaders = (authorization) =>
  authorization?.split("Bearer ")[1];

exports.TokenService = {
  verifyEncodedToken,
  createEncodedToken,
  extractTokenFromHeaders,
};
