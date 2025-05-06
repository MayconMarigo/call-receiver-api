const db = require("../../models");

(async () => {
  try {
    await db.sequelize.sync({ force: true });
    console.log("Tabelas sincronizadas com sucesso!");
  } catch (err) {
    console.error("Erro ao sincronizar tabelas:", err);
  } finally {
    process.exit();
  }
})();
