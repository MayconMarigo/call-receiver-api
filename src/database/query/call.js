const { Call } = require("../../../models");

const createCall = async (
  callId,
  callerId,
  receiverId,
  connected,
  startTime,
  endTime,
  videoUrl
) => {
  const [call, created] = await Call.findOrCreate({
    where: { callId },
    defaults: {
      callId,
      callerId,
      receiverId,
      connected,
      startTime,
      endTime,
      videoUrl,
    },
  });

  return created;
};

exports.callQueries = {
  createCall,
};
