const { ERROR_MESSAGES } = require("./constants");

const extractCodeAndMessageFromError = (stringifiedMessage) => {
  if (!stringifiedMessage)
    return {
      code: ERROR_MESSAGES.ERRORS.GENERIC_ERROR.CODE,
      message: ERROR_MESSAGES.ERRORS.GENERIC_ERROR.MESSAGE,
    };
  return JSON.parse(stringifiedMessage);
};

module.exports = {
  extractCodeAndMessageFromError,
};
