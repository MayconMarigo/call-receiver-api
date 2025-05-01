const express = require("express");
const { routesProvider } = require("./routes");
const app = express();
const port = 8080;

routesProvider(app);

app.use(express.json());

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
