const { userQueries } = require("../database/query/user");
const { ERROR_MESSAGES } = require("../utils/constants");
const { toDataURL } = require("qrcode");
const { CryptoUtils } = require("../utils/encryption");

const getUserByEmailAndPassword = async (email, password) => {
  const user = await userQueries.findUserByEmailAndPassword(email, password);

  if (!user)
    throw new Error(
      JSON.stringify({
        code: ERROR_MESSAGES.USER.NOT_FOUND.CODE,
        message: ERROR_MESSAGES.USER.NOT_FOUND.MESSAGE,
      })
    );

  return user;
};

const generateOTPAuthUrl = async (base32_secret) => {
  const totp = CryptoUtils.generateTotpConstructorWithSecret(base32_secret);

  if (!totp) throw new Error(JSON.stringify({code: ERROR_MESSAGES.TOTP.AUTH_URL.CODE, message: ERROR_MESSAGES.TOTP.AUTH_URL.MESSAGe}));

  return totp.toString();
};

const generateTotpQrCode = async (otpAuthUrl) => await toDataURL(otpAuthUrl);

const verifyTwoFactorAuthenticationCode = async (base32_secret, token) => {
  const totp = CryptoUtils.generateTotpConstructorWithSecret(base32_secret);

  const delta = totp.validate({ token, window: 1 });

  if (delta !== 0)
    throw new Error(
      JSON.stringify({
        code: ERROR_MESSAGES.CODE_EXPIRED.CODE,
        message: ERROR_MESSAGES.CODE_EXPIRED.MESSAGE,
      })
    );

  return;
};

exports.UserService = {
  getUserByEmailAndPassword,
  generateOTPAuthUrl,
  generateTotpQrCode,
  verifyTwoFactorAuthenticationCode,
};
