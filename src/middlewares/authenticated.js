const { TokenService } = require("../services/tokenService");

const isAuthenticated = (req, res, next) => {
  try {
    const { authorization } = req.headers;
    const token = TokenService.extractTokenFromHeaders(authorization)
    TokenService.verifyEncodedToken(token, process.env.JWT_SECRET_KEY);

    console.log("BOM")
  } catch (error) {
    return res.status(401).send("Unauthorized.");
  }

  next();
};

module.exports = {
  isAuthenticated,
};
