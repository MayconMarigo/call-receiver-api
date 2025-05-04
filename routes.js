exports.routesProvider = (app) => {
  // Rotas GET
  app.get("/teste", (req, res) => {
    res.send({ message: "teste" });
  });

  // Rotas POST
  app.post("/login", (req, res) => {
    console.log(req.body)
    // console.log(res)

    res.status(200).send({message: "popotão"})
  });
};

const asyncHandler = (cb) => (req, res, next) => cb(req, res, next).catch(next);
