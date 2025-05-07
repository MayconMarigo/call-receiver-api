const { isAdmin } = require("../middlewares/admin");
const { adminService } = require("../services/adminService");
const { TokenService } = require("../services/tokenService");
const { UserService } = require("../services/userService");
const { CryptoUtils } = require("../utils/encryption");
const { extractCodeAndMessageFromError } = require("../utils/error");
const { ValidationUtils } = require("../utils/validations");

exports.routesProvider = (app) => {
  // Rotas GET
  app.get("/api/v1/teste", (req, res) => {
    const data = {
      em: CryptoUtils.encryptWithCypher("maycon.marigo@teste.com.br"),
      pw: CryptoUtils.encryptWithCypher("Teste@123"),
    };
    res.send(data);
  });

  // ROTAS PUT

  app.put("/api/v1/admin/user/update", isAdmin, async (req, res) => {
    try {
      const decodedBody = await CryptoUtils.retrieveValuesFromEncryptedBody(
        req.body
      );
      ValidationUtils.checkTransformedValues(decodedBody);
      // ValidationUtils.checkRequiredValues(
      //   ["name", "email", "password", "phoneNumber", "userTypeId"],
      //   Object.keys(decodedBody)
      // );
      const created = await adminService.createUser(decodedBody);
      res.status(201).send({ created });
    } catch (error) {
      const { code, message } = extractCodeAndMessageFromError(error.message);
      res.status(code).send(message);
    }
  });

  // Rotas POST

  app.post("/api/v1/verify-token", (req, res) => {
    const { token } = req.body;
    try {
      const decodedToken = TokenService.verifyEncodedToken(token);
      res.status(200).send(decodedToken);
    } catch (error) {
      res.status(422).send({ message: error.message });
    }
  });

  app.post("/api/v1/teste2", (req, res) => {
    // const data = {
    //   em: CryptoUtils.encryptWithCypher(req.body.email),
    //   pw: CryptoUtils.encryptWithCypher(req.body.password),
    //   stfa: CryptoUtils.encryptWithCypher(req.body.secret2fa),
    //   c: CryptoUtils.encryptWithCypher(req.body.code),
    // };
    const data = {
      un: CryptoUtils.encryptWithCypher(req.body.name),
      em: CryptoUtils.encryptWithCypher(req.body.email),
      pw: CryptoUtils.encryptWithCypher(req.body.password),
      pn: CryptoUtils.encryptWithCypher(req.body.phoneNumber),
      uti: CryptoUtils.encryptWithCypher(req.body.userTypeId),
    };

    res.status(200).send(data);
  });

  app.post("/api/v1/admin/user/register", isAdmin, async (req, res) => {
    try {
      const decodedBody = await CryptoUtils.retrieveValuesFromEncryptedBody(
        req.body
      );
      ValidationUtils.checkTransformedValues(decodedBody);
      ValidationUtils.checkRequiredValues(
        ["name", "email", "password", "phoneNumber", "userTypeId"],
        Object.keys(decodedBody)
      );
      const created = await adminService.createUser(decodedBody);
      res.status(201).send({ created });
    } catch (error) {
      const { code, message } = extractCodeAndMessageFromError(error.message);
      res.status(code).send(message);
    }
  });

  app.post("/api/v1/auth", async (req, res) => {
    try {
      const decodedBody = await CryptoUtils.retrieveValuesFromEncryptedBody(
        req.body
      );
      ValidationUtils.checkRequiredValues(
        ["email", "password"],
        Object.keys(decodedBody)
      );
      const user = await UserService.getUserByEmailAndPassword(
        decodedBody.email,
        decodedBody.password
      );
      const token = TokenService.createEncodedToken(user);

      return res.status(200).send({ token: token });
    } catch (error) {
      const { code, message } = extractCodeAndMessageFromError(error.message);
      res.status(code).send(message);
    }
  });

  app.post("/api/v1/login", async (req, res) => {
    try {
      const decodedBody = await CryptoUtils.retrieveValuesFromEncryptedBody(
        req.body
      );

      ValidationUtils.checkRequiredValues(["token"], Object.keys(decodedBody));

      const { token } = decodedBody;

      const user = await TokenService.verifyEncodedToken(token);

      const otpAuthUrl = await UserService.generateOTPAuthUrl(user.secret2fa);
      const qrcodeData = await UserService.generateTotpQrCode(otpAuthUrl);

      return res
        .status(200)
        .send({ secret: user.secret2fa, qrCode: qrcodeData });
    } catch (error) {
      const { code, message } = extractCodeAndMessageFromError(error.message);
      res.status(code).send(message);
    }
  });

  app.post("/api/v1/verify-2fa", async (req, res) => {
    try {
      const decodedBody = await CryptoUtils.retrieveValuesFromEncryptedBody(
        req.body
      );
      const { code, secret2fa } = decodedBody;

      ValidationUtils.checkRequiredValues(
        ["code", "secret2fa"],
        Object.keys(decodedBody)
      );

      await UserService.verifyTwoFactorAuthenticationCode(secret2fa, code);

      return res.status(200).send({ success: true });
    } catch (error) {
      const { code, message } = extractCodeAndMessageFromError(error.message);
      res.status(code).send(message);
    }
  });
};
