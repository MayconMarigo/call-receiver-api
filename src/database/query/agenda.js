const Agenda = require("../../../models/Agenda");

const createAgenda = async (
  callId,
  callerId,
  receiverId,
  videoUrl,
  scheduledDateTime
) => {
  const [agenda, created] = await Agenda.findOrCreate({
    where: { callId },
    defaults: { callId, callerId, receiverId, videoUrl, scheduledDateTime },
  });

  return created;
};

const findAgendaByUserId = async (userId, startDate, endDate) => {
  const agenda = await Agenda.findAll({
    where: {
      userId,
      scheduledDateTime: {
        [Op.between]: [startDate, endDate],
      },
    },
    attributes: [
      "callId",
      "callerId",
      "receiverId",
      "videoUrl",
      "scheduledDateTime",
    ],
  });

  if (!agenda) return null;

  return agenda;
};

exports.agendaQueries = {
  createAgenda,
  findAgendaByUserId,
};
