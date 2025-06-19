const {
  addAgentToEndOfQueueAndChangeStatus,
  filterAvailableAgents,
  handleCallAgentBySocketId,
  modifyAgentStatusByType,
  handleAddAgentToQueueByType,
  removeAgentFromQueue,
  handleSendRoomIdToSocket,
  findCompanyCaller,
} = require("../utils/socket");

const {
  generateTokenByRoomName,
  generateAdminRoomName,
} = require("../services/dailyJsService");

const { CallService } = require("../services/callService");

exports.socketProvider = function (io) {
  let agents = [];
  io.on("connection", (socket) => {
    handleAddAgentToQueueByType(socket, agents);

    socket.on("callAvailableAgent", async (callback) => {
      console.log("callAvailableAgent");
      const agentsArray = filterAvailableAgents(agents);
      const agentToCall = agentsArray[0];
      const companyId = socket.id;
      console.log("Company ligando", companyId);

      if (agentsArray.length == 0) {
        return socket.emit("noAgentsAvailable", {
          message: "Não há agentes disponíveis.",
        });
      }

      console.log("Ligando para o agente", agentToCall);
      agents = modifyAgentStatusByType(agents, agentToCall.id, "busy");

      const agentUserName = agentToCall.user.name;
      const company = findCompanyCaller(agents, socket.id);
      const companyUserName = company.user.name;
      const randomRoomName = crypto.randomUUID();

      console.log("agentUserName", agentUserName);
      console.log("companyUserName", companyUserName);
      console.log("randomRoomName", randomRoomName);

      const companyToken = await generateTokenByRoomName(
        randomRoomName,
        companyUserName,
        true
      );

      console.log("companyToken", companyToken);

      const room = await generateAdminRoomName(randomRoomName, companyToken);

      console.log("room", room);

      const token = await generateTokenByRoomName(
        randomRoomName,
        agentUserName
      );

      handleCallAgentBySocketId(
        socket,
        agentToCall.id,
        agentToCall.user.id,
        companyId,
        company.user.id,
        room,
        token
      );

      return callback({ randomRoomName, companyToken });
    });

    socket.on("registerNotAnsweredCall", async (message) => {
      const {
        agentSocketId,
        callId,
        callerId,
        receiverId,
        connected,
        startTime,
        endTime,
        videoUrl,
        isAnonymous,
      } = message;

      await CallService.createCall(
        callId,
        callerId,
        receiverId,
        connected,
        startTime,
        endTime,
        videoUrl,
        isAnonymous
      );

      const agent = JSON.parse(socket.handshake.headers.user);
      addAgentToEndOfQueueAndChangeStatus(
        {
          id: receiverId,
          name: agent.name,
        },
        agents,
        agentSocketId
      );
    });

    socket.on("handleCallNextAgentAfterFailedCall", (message) => {
      console.log("handleCallNextAgentAfterFailedCall");
      const agentIdThatNotAnswered = message.agentId;
      agents = removeAgentFromQueue(agentIdThatNotAnswered, agents);
      const agentsArray = filterAvailableAgents(agents);
      const agentToCall = agentsArray[0];
      const companyId = message.companyId;
      console.log("agentIdThatNotAnswered", agentIdThatNotAnswered);
      console.log("agentToCall", agentToCall);
      console.log("Company ligando", companyId);
      console.log(
        "condition",
        agentsArray.length == 0 || agentToCall.id == agentIdThatNotAnswered
      );

      if (agentsArray.length == 0 || agentToCall.id == agentIdThatNotAnswered) {
        return socket.to(companyId).emit("noAgentsAvailable", {
          message: "Não há agentes disponíveis.",
        });
      }

      console.log("Ligando para o agente", agentToCall);

      agents = modifyAgentStatusByType(agents, agentToCall.id, "busy");

      handleCallAgentBySocketId(
        socket,
        agentToCall.id,
        companyId,
        message.roomId
      );
    });

    socket.on("registerCallInformation", async (message) => {
      console.log("registerCallInformation", message);

      const {
        callId,
        callerId,
        receiverId,
        connected,
        startTime,
        endTime,
        videoUrl,
        isAnonymous,
      } = message;

      await CallService.createCall(
        callId,
        callerId,
        receiverId,
        connected,
        startTime,
        endTime,
        videoUrl,
        isAnonymous
      );
    });

    socket.on("incomingCallResponse", (message) => {
      console.log("incomingCallResponse");
      const { companyId, status } = message;
      handleSendRoomIdToSocket(socket, companyId, status);
    });

    socket.on("handleChangeAgentStatusToBusy", (message) => {
      console.log("handleChangeAgentStatusToBusy");
      const { id: agentToModify } = message;
      agents = modifyAgentStatusByType(agents, agentToModify, "busy");
    });

    socket.on("handleChangeAgentStatusToAvailable", (message) => {
      console.log("handleChangeAgentStatusToAvailable");
      const { id: agentToModify } = message;
      agents = modifyAgentStatusByType(agents, agentToModify, "available");
    });

    socket.on("getAvailableAgents", (callback) => {
      console.log("ALL AGENTS", agents);
      const availableAgents = filterAvailableAgents(agents);
      console.log("available agents", availableAgents);

      return callback(availableAgents);
    });

    socket.on("disconnect", () => {
      const userType = socket.handshake.headers.type;
      console.log(`${userType} desconectado:`, socket.id);
      agents = agents.filter((agent) => agent.id !== socket.id);
    });
  });
};
