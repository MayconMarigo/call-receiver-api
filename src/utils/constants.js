//TOTP
const TOTP = {
  AUTHENTICATOR_TIMEOUT: 60,
  AUTHENTICATOR_NAME: "Call Receiver Api",
};

//JWT
const JWT_TOKEN_EXPIRY_TIME = 3600;

// DATABASE
const ACTIVE_USER_STATUS = 1;

//ERROR MESSAGES

const ERROR_MESSAGES = {
  CREDENTIALS_CHANGED: {
    code: 401,
    message: "Credentials changed while on this session, please authenticate again.",
  },
  UNAUTHORIZED: {
    code: 401,
    message: "Unauthorized.",
  },
  MALFORMATTED_FIELDS: {
    message: "One or more malformatted or missing field values.",
    code: 422,
  },
  CODE_EXPIRED: {
    code: 401,
    message: "Code expired or invalid.",
  },
  USER: {
    NOT_FOUND: {
      code: 404,
      message: "If user exists, please check login and password.",
    },
    ALREADY_EXISTS: {
      message: "User already exists.",
      code: 422,
    },
  },
  TOKEN: {
    INVALID_TOKEN: {
      code: 401,
      message: "Invalid token.",
    },
  },
  TOTP: {
    AUTH_URL: {
      code: 422,
      message: "Error while generating auth url.",
    },
  },
  ERRORS: {
    GENERIC_ERROR: {
      code: 400,
      message:
        "Error while processing this request, please try again in a few instants.",
    },
  },
};

module.exports = {
  TOTP,
  JWT_TOKEN_EXPIRY_TIME,
  ACTIVE_USER_STATUS,
  ERROR_MESSAGES,
};
