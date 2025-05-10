const { isAdmin } = require("../middlewares/admin");
const { isAuthenticated } = require("../middlewares/authenticated");
const { adminService } = require("../services/adminService");
const { CallService } = require("../services/callService");
const { RatingService } = require("../services/ratingService");
const { TokenService } = require("../services/tokenService");
const { UserService } = require("../services/userService");
const { CryptoUtils } = require("../utils/encryption");
const {
  extractCodeAndMessageFromError,
  formatErrorFieldsMessageFromDatabase,
} = require("../utils/error");
const { ValidationUtils } = require("../utils/validations");

exports.routesProvider = (app) => {
  // Rotas GET
  app.get("/api/v1/admin/reports/:userId", isAdmin, async (req, res) => {
    try {
      ValidationUtils.checkRequiredValues(
        ["userId", "startDate", "endDate", "type"],
        [...Object.keys(req.params), ...Object.keys(req.query)]
      );

      const { startDate, endDate, type } = req.query;
      const { userId } = req.params;

      const reports = await adminService.findAllCallsByUserIdAndType(
        userId,
        startDate,
        endDate,
        type
      );

      res.status(200).send(reports);
    } catch (error) {
      console.log(error);
      const { code, message } = extractCodeAndMessageFromError(error.message);
      res.status(code).send(message);
    }
  });

  // ROTAS PUT

  app.put("/api/v1/admin/user/update", isAdmin, async (req, res) => {
    try {
      const decodedBody = await CryptoUtils.retrieveValuesFromEncryptedBody(
        req.body
      );

      ValidationUtils.checkRequiredValues(
        ["userId", "name", "email", "phone", "password", "status"],
        Object.keys(decodedBody)
      );
      ValidationUtils.checkTransformedValues(decodedBody);

      await adminService.updateUserByUserId(decodedBody);

      res.status(204).send();
    } catch (error) {
      const { code, message } = extractCodeAndMessageFromError(error.message);
      const formattedErrorMessage = formatErrorFieldsMessageFromDatabase(error);

      res.status(code).send(`${message} ${formattedErrorMessage}`);
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
    // const data = {
    //   un: CryptoUtils.encryptWithCypher(req.body.name),
    //   em: CryptoUtils.encryptWithCypher(req.body.email),
    //   pw: CryptoUtils.encryptWithCypher(req.body.password),
    //   pn: CryptoUtils.encryptWithCypher(req.body.phoneNumber),
    //   uti: CryptoUtils.encryptWithCypher(req.body.userTypeId),
    // };

    const data = {
      uid: CryptoUtils.encryptWithCypher(
        "7f7418be-6ce1-49ab-8caf-e0096b9a04b6"
      ),
      nm: CryptoUtils.encryptWithCypher("Maycon Marigo Teste"),
      em: CryptoUtils.encryptWithCypher("maycon.marigo@teste.com.br"),
      pn: CryptoUtils.encryptWithCypher("43912345678"),
      pw: CryptoUtils.encryptWithCypher("Teste@teste"),
      sts: CryptoUtils.encryptWithCypher("1"),
    };

    res.status(200).send(data);
  });

  app.post("/api/v1/admin/reports", isAdmin, async (req, res) => {
    try {
      const decodedBody = await CryptoUtils.retrieveValuesFromEncryptedBody(
        req.body
      );

      ValidationUtils.checkRequiredValues(
        ["startDate", "endDate"],
        Object.keys(decodedBody)
      );
      ValidationUtils.checkTransformedValues(decodedBody);

      const { startDate, endDate } = decodedBody;

      const reports = await adminService.findAllCalls(startDate, endDate);

      res.status(200).send(reports);
    } catch (error) {
      const { code, message } = extractCodeAndMessageFromError(error.message);
      res.status(code).send(message);
    }
  });

  app.post("/api/v1/admin/user/create", isAdmin, async (req, res) => {
    try {
      const decodedBody = await CryptoUtils.retrieveValuesFromEncryptedBody(
        req.body
      );

      ValidationUtils.checkRequiredValues(
        ["name", "email", "password", "phoneNumber", "userTypeId"],
        Object.keys(decodedBody)
      );
      ValidationUtils.checkTransformedValues(decodedBody);

      const created = await adminService.createUser(decodedBody);
      res.status(201).send({ created });
    } catch (error) {
      const { code, message } = extractCodeAndMessageFromError(error.message);
      res.status(code).send(message);
    }
  });

  app.post("/api/v1/rating/create", isAuthenticated, async (req, res) => {
    try {
      const decodedBody = await CryptoUtils.retrieveValuesFromEncryptedBody(
        req.body
      );

      ValidationUtils.checkRequiredValues(
        ["callId", "rating"],
        Object.keys(decodedBody)
      );
      ValidationUtils.checkTransformedValues(decodedBody);

      const { callId, rating } = decodedBody;

      const created = await RatingService.createRating(callId, rating);

      res.status(201).send({ created });
    } catch (error) {
      const { code, message } = extractCodeAndMessageFromError(error.message);
      res.status(code).send(message);
    }
  });

  app.post("/api/v1/call/create", isAuthenticated, async (req, res) => {
    try {
      const decodedBody = await CryptoUtils.retrieveValuesFromEncryptedBody(
        req.body
      );
      ValidationUtils.checkRequiredValues(
        [
          "callId",
          "callerId",
          "receiverId",
          "connected",
          "startTime",
          "endTime",
        ],
        Object.keys(decodedBody)
      );
      ValidationUtils.checkTransformedValues(decodedBody);

      const { callId, callerId, receiverId, connected, startTime, endTime } =
        decodedBody;

      const created = await CallService.createCall(
        callId,
        callerId,
        receiverId,
        connected,
        startTime,
        endTime,
        decodedBody?.videoUrl ?? null
      );

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
      ValidationUtils.checkTransformedValues(decodedBody);

      const { email, password, encryptedPassword } = decodedBody;

      const user = await UserService.getUserByEmailAndPassword(email, password);
      const token = TokenService.createEncodedToken({...user, encryptedPassword});

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
      ValidationUtils.checkTransformedValues(decodedBody);

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
      ValidationUtils.checkTransformedValues(decodedBody);

      await UserService.verifyTwoFactorAuthenticationCode(secret2fa, code);

      return res.status(200).send({ success: true });
    } catch (error) {
      const { code, message } = extractCodeAndMessageFromError(error.message);
      res.status(code).send(message);
    }
  });
};
