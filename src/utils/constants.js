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
  UNAUTHORIZED: {
    CODE: 401,
    MESSAGE: "Unauthorized.",
  },
  MALFORMATTED_FIELDS: {
    MESSAGE: "One or more malformatted field value.",
    CODE: 422,
  },
  CODE_EXPIRED: {
    CODE: 401,
    MESSAGE: "Code expired or invalid.",
  },
  USER: {
    NOT_FOUND: {
      CODE: 404,
      MESSAGE: "If user exists, please check login and password.",
    },
    ALREADY_EXISTS: {
      MESSAGE: "User already exists.",
      CODE: 422,
    },
  },
  TOKEN: {
    INVALID_TOKEN: {
      CODE: 401,
      MESSAGE: "Invalid token.",
    },
  },
  TOTP: {
    AUTH_URL: {
      CODE: 422,
      MESSAGE: "Error while generating auth url.",
    },
  },
  ERRORS: {
    GENERIC_ERROR: {
      CODE: 400,
      MESSAGE:
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
