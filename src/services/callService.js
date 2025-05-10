const { callQueries } = require("../database/query/call");

const createCall = async (
  callId,
  callerId,
  receiverId,
  connected,
  startTime,
  endTime,
  videoUrl
) => {
  const call = await callQueries.createCall(
    callId,
    callerId,
    receiverId,
    connected,
    startTime,
    endTime,
    videoUrl
  );

  return call;
};

exports.CallService = {
  createCall,
};
