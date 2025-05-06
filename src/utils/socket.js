const removeFirstAgentFromQueue = (arr) => arr.shift();

const removeAgentFromQueue = (agentId, arr) => arr.filter(value => value.id !== agentId && value.type !== "available") 

const addAgentToEndOfQueueAndChangeStatus = (agent, arr) =>
  arr.push({ id: agent, status: "available", type: "agent" });

const filterAvailableAgents = (arr) =>
  arr.filter((agent) => agent.status === "available" && agent.type === "agent");

const handleCallAgentBySocketId = (socket, agentId, companyId, roomId) =>
  socket.to(agentId).emit("incomingCall", { companyId, agentId, roomId });

const modifyAgentStatusByType = (agents, agentIdToModify, status) =>
  agents.map((agent) => {
    if (agent.id === agentIdToModify) {
      return {
        ...agent,
        status,
      };
    }
    return agent;
  });

const handleAddAgentToQueueByType = (agent, agentQueue) => {
  const isAgent = agent.handshake.headers.type === "agent";

  const pushObject = {
    id: agent.id,
    status: isAgent ? "available" : null,
    type: isAgent ? "agent" : "company",
  };

  if (isAgent) {
    console.log("Agente Conectado", agent.id);
    agentQueue.push(pushObject);

    return;
  }

  console.log("Company Conectado", agent.id);
  agentQueue.push(pushObject);
};

const handleSendRoomIdToSocket = (socket, roomId, destinyId) => {
  socket.to(destinyId).emit("redirectToRoom", {roomId})
}

module.exports = {
  removeFirstAgentFromQueue,
  addAgentToEndOfQueueAndChangeStatus,
  filterAvailableAgents,
  handleCallAgentBySocketId,
  modifyAgentStatusByType,
  handleAddAgentToQueueByType,
  removeAgentFromQueue,
  handleSendRoomIdToSocket
};
