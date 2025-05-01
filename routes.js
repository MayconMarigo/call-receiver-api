exports.routesProvider = (app) => {
  // Rotas GET
  app.get("/", (req, res) => {
    res.send("Hello World!");
  });

  // Rotas POST
};

const asyncHandler = (cb) => (req, res, next) => cb(req, res, next).catch(next)
