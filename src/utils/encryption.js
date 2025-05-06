const Crypto = require("crypto-js")

const encryptWithCypher = (value) =>
  Crypto.AES.encrypt(value, process.env.CRYPTO_KEY).toString();

const decryptWithCypher = (value) => {
  const bytes = Crypto.AES.decrypt(value, process.env.CRYPTO_KEY);
  const decrypted = bytes.toString(Crypto.enc.Utf8);

  return decrypted;
};

const encryptionDictionary = [
  { key: "un", value: "userName" },
  { key: "pw", value: "password" },
  { key: "em", value: "email" },
  { key: "dc", value: "document" },
  { key: "zc", value: "zipcode" },
  { key: "ad", value: "address" },
  { key: "hn", value: "addressNumber" },
  { key: "st", value: "state" },
  { key: "ct", value: "city" },
  { key: "pn", value: "phoneNumber" },
];

const retrieveValuesFromEncryptedBody = (body) => {
  const decryptedBody = {};
  const encryptedBody = Object.keys(body);
  encryptionDictionary.forEach((object) => {
    encryptedBody.forEach((key) => {
      if (object.key == key && key !== "pw") {
        return (decryptedBody[object.value] = decryptWithCypher(body[key]));
      }
      if(object.key == "pw" && key == "pw"){
        return (decryptedBody[object.value] = body["pw"])
      }
    });
  });

  return decryptedBody;
};

exports.CryptoUtils = {
  encryptWithCypher,
  decryptWithCypher,
  retrieveValuesFromEncryptedBody,
};
