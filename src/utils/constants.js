//TOTP
const TOTP = {
  AUTHENTICATOR_TIMEOUT: 30,
  AUTHENTICATOR_NAME: "call-receiver-api",
};

//URLS

const BASE_DAILY_JS_URL = "https://api.daily.co/v1";

//JWT
const JWT_TOKEN_EXPIRY_TIME = 3600;

// DATABASE
const ACTIVE_USER_STATUS = 1;

// USER TYPES

const USER_TYPES = {
  1: "admin",
  2: "company",
  3: "agent",
};

//ERROR MESSAGES

const ERROR_MESSAGES = {
  CREDENTIALS_CHANGED: {
    code: 401,
    message:
      "Credenciais alteradas durante sua sessão, por favor faça login novamente.",
  },
  UNAUTHORIZED: {
    code: 401,
    message: "Não autorizado.",
  },
  MALFORMATTED_FIELDS: {
    code: 422,
    message: "Um ou mais campos mal formatados ou ausentes.",
  },
  CODE_EXPIRED: {
    code: 401,
    message: "Código expirado ou inválido.",
  },
  USER: {
    NOT_FOUND: {
      code: 422,
      message: "Se o usuário existir, por favor verifique o email e senha.",
    },
    ALREADY_EXISTS: {
      message: "Usuário já existe na base de dados.",
      code: 422,
    },
  },
  TOKEN: {
    INVALID_TOKEN: {
      code: 401,
      message: "Token inválido.",
    },
  },
  TOTP: {
    AUTH_URL: {
      code: 422,
      message: "Erro ao gerar URL de autenticação.",
    },
  },
  ERRORS: {
    GENERIC_ERROR: {
      code: 500,
      message:
        "Erro ao processar requisição, por favor tente novamente em alguns instantes.",
    },
  },
};

module.exports = {
  TOTP,
  JWT_TOKEN_EXPIRY_TIME,
  ACTIVE_USER_STATUS,
  ERROR_MESSAGES,
  USER_TYPES,
  BASE_DAILY_JS_URL,
};
