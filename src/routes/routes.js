const { isAdmin } = require("../middlewares/admin");
const { isAuthenticated } = require("../middlewares/authenticated");
const { adminService } = require("../services/adminService");
const { agendaService } = require("../services/agendaService");
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

      ValidationUtils.checkTransformedValues({ ...req.query, ...req.params });

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
      const { code, message } = extractCodeAndMessageFromError(error.message);
      res.status(code).send({ message });
    }
  });

  app.get("/api/v1/admin/users/get-all", isAdmin, async (req, res) => {
    try {
      const users = await adminService.getAllUsers();

      res.status(200).send(users);
    } catch (error) {
      const { code, message } = extractCodeAndMessageFromError(error.message);
      res.status(code).send({ message });
    }
  });

  app.get("/api/v1/admin/calls/get-all", isAdmin, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;

      ValidationUtils.checkTransformedValues(req.query);

      const calls = await adminService.getAllCalls(startDate, endDate);

      res.status(200).send(calls);
    } catch (error) {
      const { code, message } = extractCodeAndMessageFromError(error.message);
      res.status(code).send({ message });
    }
  });

  // ROTAS PUT

  app.put("/api/v1/admin/user/update", isAdmin, async (req, res) => {
    try {
      const decodedBody = await CryptoUtils.retrieveValuesFromEncryptedBody(
        req.body
      );
      ValidationUtils.checkRequiredValues(
        ["name", "email", "password", "status"],
        Object.keys(decodedBody)
      );
      ValidationUtils.checkTransformedValues(decodedBody);

      await adminService.updateUserByUserEmail(decodedBody);

      res.status(204).send();
    } catch (error) {
      const { code, message } = extractCodeAndMessageFromError(error.message);

      res.status(code).send({ message });
    }
  });

  // Rotas POST

  app.post("/api/v1/verify-token", async (req, res) => {
    try {
      const decodedBody = await CryptoUtils.retrieveValuesFromEncryptedBody(
        req.body
      );

      ValidationUtils.checkRequiredValues(["token"], Object.keys(decodedBody));
      ValidationUtils.checkTransformedValues(decodedBody);

      const { token } = decodedBody;

      const decodedUser = await TokenService.verifyEncodedToken(token, [
        "type",
        "id",
      ]);

      res.status(200).send(decodedUser);
    } catch (error) {
      const { code, message } = extractCodeAndMessageFromError(error.message);
      const formattedErrorMessage = formatErrorFieldsMessageFromDatabase(error);

      res.status(code).send(`${message} ${formattedErrorMessage}`);
    }
  });

  app.post("/api/v1/teste2", async (req, res) => {
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
      res.status(code).send({ message });
    }
  });

  app.post("/api/v1/admin/user/create", isAdmin, async (req, res) => {
    try {
      const decodedBody = await CryptoUtils.retrieveValuesFromEncryptedBody(
        req.body
      );

      ValidationUtils.checkRequiredValues(
        ["name", "email", "password", "userTypeId"],
        Object.keys(decodedBody)
      );
      ValidationUtils.checkTransformedValues(decodedBody);

      const created = await adminService.createUser(decodedBody);
      res.status(201).send({ created });
    } catch (error) {
      const { code, message } = extractCodeAndMessageFromError(error.message);
      res.status(code).send({ message });
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
      res.status(code).send({ message });
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
        decodedBody?.videoUrl ?? null,
        decodedBody?.isAnonymous ?? false
      );

      res.status(201).send({ created });
    } catch (error) {
      const { code, message } = extractCodeAndMessageFromError(error.message);
      res.status(code).send({ message });
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
      const token = TokenService.createEncodedToken({
        ...user,
        encryptedPassword,
      });

      return res.status(200).send({ token: token });
    } catch (error) {
      const { code, message } = extractCodeAndMessageFromError(error.message);

      res.status(code).send({ message });
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
      res.status(code).send({ message });
    }
  });

  app.post("/api/v1/user-data", isAuthenticated, async (req, res) => {
    try {
      const decodedBody = await CryptoUtils.retrieveValuesFromEncryptedBody(
        req.body
      );

      ValidationUtils.checkRequiredValues(["token"], Object.keys(decodedBody));
      ValidationUtils.checkTransformedValues(decodedBody);

      const { token } = decodedBody;

      const data = await UserService.getUserDataByToken(token);

      return res.status(200).send(data);
    } catch (error) {
      const { code, message } = extractCodeAndMessageFromError(error.message);
      const formattedErrorMessage = formatErrorFieldsMessageFromDatabase(error);

      res.status(code).send({ message: `${message} ${formattedErrorMessage}` });
    }
  });

  app.post("/api/v1/verify-2fa", isAuthenticated, async (req, res) => {
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
      const formattedErrorMessage = formatErrorFieldsMessageFromDatabase(error);

      res.status(code).send({ message: `${message} ${formattedErrorMessage}` });
    }
  });

  app.post("/api/v1/agenda/create", isAuthenticated, async (req, res) => {
    try {
      const decodedBody = await CryptoUtils.retrieveValuesFromEncryptedBody(
        req.body
      );
      const { callId, callerId, receiverId, videoUrl, scheduledDateTime } =
        decodedBody;

      ValidationUtils.checkRequiredValues(
        ["callId", "callerId", "receiverId", "videoUrl", "scheduledDateTime"],
        Object.keys(decodedBody)
      );
      ValidationUtils.checkTransformedValues(decodedBody);

      await agendaService.createAgenda(
        callId,
        callerId,
        receiverId,
        videoUrl,
        scheduledDateTime
      );

      res.status(204).send();
    } catch (error) {
      const { code, message } = extractCodeAndMessageFromError(error.message);
      res.status(code).send({ message });
    }
  });

  app.post("/api/v1/agenda/:userId", isAuthenticated, async (req, res) => {
    try {
      const { startDate, endDate } = req.query;
      const { userId } = req.params;

      ValidationUtils.checkRequiredValues(
        ["userId", "startDate", "endDate", "videoUrl", "scheduledDateTime"],
        [...Object.keys(req.params), ...Object.keys(req.query)]
      );
      ValidationUtils.checkTransformedValues({ ...req.query, ...req.params });

      await agendaService.findAgendaByUserId(userId, startDate, endDate);

      res.status(204).send();
    } catch (error) {
      const { code, message } = extractCodeAndMessageFromError(error.message);
      res.status(code).send({ message });
    }
  });
};
