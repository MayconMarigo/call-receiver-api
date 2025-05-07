require("dotenv").config();
const CryptoJs = require("crypto-js");
const Crypto = require("crypto");
const bcrypt = require("bcrypt");
const { TOTP } = require("./constants");
const base32 = require("base-32").default;
const OTPAuth = require("otpauth");

const encryptWithCypher = (value) =>
  CryptoJs.AES.encrypt(value, process.env.CRYPTO_KEY).toString();

const decryptWithCypher = (value) => {
  if (!value) return;
  const bytes = CryptoJs.AES.decrypt(value, process.env.CRYPTO_KEY);
  const decrypted = bytes.toString(CryptoJs.enc.Utf8);

  return decrypted;
};

const retrieveValuesFromEncryptedBody = async (body) => {
  const hashedPassword = await convertToDatabaseFormatedPassword(
    decryptWithCypher(body?.pw)
  );

  const encryptionDictionary = [
    {
      key: "nm",
      transformedValue: decryptWithCypher(body?.nm),
      name: "name",
    },
    { key: "pw", transformedValue: hashedPassword, name: "password" },
    { key: "em", transformedValue: decryptWithCypher(body?.em), name: "email" },
    {
      key: "dc",
      transformedValue: decryptWithCypher(body?.dc),
      name: "document",
    },
    {
      key: "zc",
      transformedValue: decryptWithCypher(body?.zc),
      name: "zipcode",
    },
    {
      key: "ad",
      transformedValue: decryptWithCypher(body?.ad),
      name: "address",
    },
    {
      key: "hn",
      transformedValue: decryptWithCypher(body?.hn),
      name: "addressNumber",
    },
    { key: "st", transformedValue: decryptWithCypher(body?.st), name: "state" },
    { key: "ct", transformedValue: decryptWithCypher(body?.ct), name: "city" },
    {
      key: "pn",
      transformedValue: decryptWithCypher(body?.pn),
      name: "phoneNumber",
    },
    {
      key: "stfa",
      transformedValue: decryptWithCypher(body?.stfa),
      name: "secret2fa",
    },
    { key: "t", transformedValue: body?.t, name: "token" },
    { key: "c", transformedValue: decryptWithCypher(body?.c), name: "code" },
    { key: "uti", transformedValue: decryptWithCypher(body?.uti), name: "userTypeId" },
  ];

  const decryptedBody = {};
  const encryptedBody = Object.keys(body);

  encryptionDictionary.forEach(() => {
    encryptedBody.forEach((key) => {
      const match = encryptionDictionary.find((value) => value.key == key);
      decryptedBody[match.name] = match.transformedValue;
    });
  });

  return decryptedBody;
};

const convertToDatabaseFormatedPassword = async (password) => {
  if(!password) return;
  const hash = bcrypt.hash(password, process.env.BCRYPT_SALT_KEY);

  return hash;
};

const generateBase32Hash = () => {
  const buffer = Crypto.randomBytes(15);
  const hash = base32.encode(buffer).replace(/=/g, "").substring(0, 24);

  return hash;
};

const generateTotpConstructorWithSecret = (base32_secret) =>
  new OTPAuth.TOTP({
    issuer: TOTP.AUTHENTICATOR_NAME,
    label: "2fa",
    algorithm: "SHA1",
    period: TOTP.AUTHENTICATOR_TIMEOUT,
    digits: 6,
    secret: base32_secret,
  });

exports.CryptoUtils = {
  encryptWithCypher,
  decryptWithCypher,
  retrieveValuesFromEncryptedBody,
  convertToDatabaseFormatedPassword,
  generateBase32Hash,
  generateTotpConstructorWithSecret,
};
