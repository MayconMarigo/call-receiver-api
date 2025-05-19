const { agendaQueries } = require("../database/query/agenda");

const createAgenda = async (
  callId,
  callerId,
  receiverId,
  videoUrl,
  scheduledDateTime
) => {
  const created = await agendaQueries.createAgenda(
    callId,
    callerId,
    receiverId,
    videoUrl,
    scheduledDateTime
  );

  return created;
};

const findAgendaByUserId = async (userId, startDate, endDate) => {
  const agenda = await agendaQueries.findAgendaByUserId(
    userId,
    startDate,
    endDate
  );

  return agenda;
};

exports.agendaService = {
  createAgenda,
  findAgendaByUserId,
};
