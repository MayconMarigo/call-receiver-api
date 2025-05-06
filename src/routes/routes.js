const { userQueries } = require("../database/query/user");
const { isAdmin } = require("../middlewares/admin");
const { isAuthenticated } = require("../middlewares/authenticated");
const { TokenService } = require("../services/tokenService");
const { UserService } = require("../services/userService");
const { CryptoUtils } = require("../utils/encryption");
const { ValidationUtils } = require("../utils/validations");

exports.routesProvider = (app) => {
  // Rotas GET
  app.get("/teste", (req, res) => {
    const data = {
      em: CryptoUtils.encryptWithCypher("maycon.marigo@teste.com.br"),
      pw: CryptoUtils.encryptWithCypher("Teste@123"),
    };
    res.send(data);
  });

  // Rotas POST

  app.post("/generate-token", (req, res) => {
    const body = CryptoUtils.retrieveValuesFromEncryptedBody(req.body);
    // const data = await getUserByUserNameAndPassword(...body);
    //data vem do banco
    const data = {};
    const token = TokenService.createEncodedToken(data);

    return res.status(200).send({ token: token });
  });

  app.post("/verify-token", (req, res) => {
    const { token } = req.body;
    try {
      const decodedToken = TokenService.verifyEncodedToken(token);
      res.status(200).send(decodedToken);
    } catch (error) {
      res.status(422).send({ message: error.message });
    }
  });

  app.post("/teste2", (req, res) => {
    const data = {
      em: CryptoUtils.encryptWithCypher(req.body.email),
      pw: CryptoUtils.encryptWithCypher(req.body.password),
    };

    res.status(200).send(data);
  });

  app.post("/admin/register", isAdmin, (req, res) => {
    res.status(201).send();
  });

  app.post("/auth", async (req, res) => {
    try {
      const decodedBody = CryptoUtils.retrieveValuesFromEncryptedBody(req.body);

      ValidationUtils.checkRequiredValues(
        ["email", "password"],
        Object.keys(decodedBody)
      );

      const user = await UserService.login(
        decodedBody.email,
        decodedBody.password
      );
      const token = TokenService.createEncodedToken(user);

      return res.status(200).send({ token: token });
    } catch (error) {
      console.log(error);
      return res.status(412).send({ message: error.message });
    }
  });

  app.post("/login", async (req, res) => {
    try {
      const { token, tfa } = req.body;

      ValidationUtils.checkRequiredValues(
        ["token", "tfa"],
        Object.keys(req.body)
      );

     

      return res.status(200).send({ token: token });
    } catch (error) {
      console.log(error);
      return res.status(412).send({ message: error.message });
    }
  });
};
