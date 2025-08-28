const { credentialsQueries } = require("../database/query/credentials");

const findValidCredential = async (credential) => {
  const isValid = await credentialsQueries.findValidCredential(credential);

  return isValid;
};

const getUserAgendaWithCredential = async (startDate, endDate, credential) => {
  const agenda = await credentialsQueries.getUserAgendaWithCredential(
    startDate,
    endDate,
    credential
  );

  return agenda;
};

const getUsersListWithCredential = async (credential) => {
  const users = await credentialsQueries.getUsersListWithCredential(credential);

  return users;
};

const associateAgendaToUser = async (credential, agendaId) => {
  const updated = await credentialsQueries.associateAgendaToUser(
    credential,
    agendaId
  );

  return updated;
};

exports.credentialsService = {
  findValidCredential,
  getUserAgendaWithCredential,
  getUsersListWithCredential,
  associateAgendaToUser,
};
