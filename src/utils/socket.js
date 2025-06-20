const removeFirstAgentFromQueue = (arr) => arr.shift();

const removeAgentFromQueue = (agentId, arr) =>
  arr.filter((value) => value.id !== agentId && value.type !== "available");

const addAgentToEndOfQueueAndChangeStatus = (user, arr, socketId) =>
  arr.push({ id: socketId, status: "available", type: "agent", user });

const filterAvailableAgents = (arr) =>
  arr.filter((agent) => agent.status === "available" && agent.type === "agent");

const handleCallAgentBySocketId = (
  socket,
  agentId,
  agentUserId,
  companyId,
  companyUserId,
  room,
  token
) =>
  socket.to(agentId).emit("incomingCall", {
    company: { socketId: companyId, userId: companyUserId },
    agent: { socketId: agentId, userId: agentUserId },
    room,
    token,
  });

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

const handleAddAgentToQueueByType = async (agent, agentQueue) => {
  const isAgent = agent.handshake.headers.type === "agent";
  let user;

  try {
    const parsed = JSON.parse(agent?.handshake?.headers?.user);
    user = parsed;
  } catch (error) {
    return (user = { name: "Anônimo", id: null });
  }

  const pushObject = {
    id: agent.id,
    status: isAgent ? "available" : null,
    type: isAgent ? "agent" : "company",
    user,
  };

  if (isAgent) {
    console.log("Agente Conectado", agent.id);
    agentQueue.push(pushObject);

    return;
  }
  console.log("Company Conectado", agent.id);
  agentQueue.push(pushObject);
};

const handleSendRoomIdToSocket = (socket, destinyId, status) => {
  socket.to(destinyId).emit("redirectToRoom", { ok: status });
};

const findCompanyCaller = (agents, socketId) =>
  agents.find((agent) => agent.type === "company" && agent.id == socketId);

module.exports = {
  removeFirstAgentFromQueue,
  addAgentToEndOfQueueAndChangeStatus,
  filterAvailableAgents,
  handleCallAgentBySocketId,
  modifyAgentStatusByType,
  handleAddAgentToQueueByType,
  removeAgentFromQueue,
  handleSendRoomIdToSocket,
  findCompanyCaller,
};
