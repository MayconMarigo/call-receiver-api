const {
  addAgentToEndOfQueueAndChangeStatus,
  filterAvailableAgents,
  handleCallAgentBySocketId,
  modifyAgentStatusByType,
  handleAddAgentToQueueByType,
  removeAgentFromQueue,
  handleSendRoomIdToSocket
} = require("../utils/socket");

exports.socketProvider = function (io) {
  let agents = [];
  io.on("connection", (socket) => {
    handleAddAgentToQueueByType(socket, agents);

    socket.on("callAvailableAgent", (callback) => {
      console.log("callAvailableAgent")
      const agentsArray = filterAvailableAgents(agents);
      const agentToCall = agentsArray[0];
      const companyId = socket.id;
      console.log("Company ligando", companyId)
      console.log("Ligando para o agente", agentToCall);
      if (agentsArray.length == 0){
        return callback({ message: "Não há agentes disponíveis." });
        // console.log({ message: "Não há agentes disponíveis." });
        // return;
      }

      agents = modifyAgentStatusByType(agents, agentToCall.id, "busy");

      //todo
      const roomId = crypto.randomUUID(); 
      // bater na api e pegar o room id
      handleCallAgentBySocketId(socket, agentToCall.id, companyId, roomId);

      // socket.emit("callAvailableAgentResponse", roomId);

      // return callback(roomId)
    });

    socket.on("handleCallNextAgentAfterFailedCall", message => {
      console.log("handleCallNextAgentAfterFailedCall")
      const agentIdThatNotAnswered = message.agentId;
      agents = removeAgentFromQueue(agentIdThatNotAnswered, agents)
      addAgentToEndOfQueueAndChangeStatus(agentIdThatNotAnswered, agents);
      const agentsArray = filterAvailableAgents(agents);
      const agentToCall = agentsArray[0];
      const companyId = message.companyId;
      console.log("Company ligando", companyId)
      console.log("Ligando para o agente", agentToCall);
      if (agentsArray.length == 0){
        // return callback({ message: "Não há agentes disponíveis." });
        console.log({ message: "Não há agentes disponíveis." });
        return;
      }
      agents = modifyAgentStatusByType(agents, agentToCall.id, "busy");
      handleCallAgentBySocketId(socket, agentToCall.id, companyId, message.roomId);
    });

    socket.on("incomingCallResponse", (message) => {
      console.log(message)
      console.log("incomingCallResponse")
      const {companyId, roomId} = message;
      handleSendRoomIdToSocket(socket, roomId, companyId);
    })

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
      console.log("Cliente desconectado:", socket.id);
      agents = agents.filter((agent) => agent.id !== socket.id);
    });
  });
};
