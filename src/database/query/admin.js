const { User, Call } = require("../../../models");
const Crypto = require("crypto");
const { CryptoUtils } = require("../../utils/encryption");
const { Op } = require("@sequelize/core");
const { literal } = require("sequelize");
const { userUtils } = require("../../utils/user");
const { dateUtils } = require("../../utils/date");
const { sequelize } = require("../database");

const createUser = async (payload) => {
  const { name, email, phone, password, userTypeId, logoImage, color } =
    payload;

  const secret2fa = CryptoUtils.generateBase32Hash();
  const [user, created] = await User.findOrCreate({
    where: { email },
    defaults: {
      id: Crypto.randomUUID(),
      name,
      email,
      phone,
      password,
      logoImage,
      colorScheme: color,
      status: 1,
      userTypeId,
      secret2fa,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return created;
};

const updateUserByUserEmail = async (payload) => {
  const { name, email, phone, password, status, userTypeId } = payload;

  const updated = await User.update(
    {
      name,
      email,
      phone,
      password,
      status,
      userTypeId,
      updatedAt: new Date(),
    },
    {
      where: { email },
    }
  );

  return updated;
};

const getAllCalls = async (startDate, endDate) => {
  let initDate = "";
  let finalDate = "";

  if (!startDate) {
    initDate = dateUtils.substractDaysFromNewDate(30);
  }

  if (!endDate) {
    finalDate = new Date();
  }
  
  const [reports] = await sequelize.query(`
      SELECT
        caller.name AS callerName,
        receiver.name AS receiverName,
        c.startTime AS formattedStartTime,
        c.endTime AS formattedEndTime,
        c.videoUrl,
        TIMESTAMPDIFF(MINUTE, c.startTime, c.endTime) AS callDuration
      FROM calls c
      INNER JOIN users caller ON c.callerId = caller.id
      INNER JOIN users receiver ON c.receiverId = receiver.id;
    `);

  return reports;
};

const findAllCallsByUserIdAndType = async (
  userId,
  startDate,
  endDate,
  type
) => {
  const types = {
    agent: "receiverId",
    company: "callerId",
  };

  const report = await Call.findAll({
    where: {
      [types[type]]: userId,
      createdAt: {
        [Op.between]: [startDate, endDate],
      },
    },
    attributes: [
      "connected",
      "startTime",
      "endTime",
      "callId",
      "callerId",
      "videoUrl",
      [
        literal("TIMESTAMPDIFF(MINUTE, startTime, endTime)"),
        "durationInMinutes",
      ],
    ],
  });

  return report;
};

const getAllUsers = async () => {
  const data = await User.findAll({
    attributes: ["name", "email", "phone", "userTypeId", "status"],
  });

  if (!data) return null;

  const users = data.map((user) => {
    if (user.userTypeId)
      user.userTypeId = userUtils.checkUserType(user.userTypeId);

    if (user.status == 1) user.status = "Ativo";

    if (user.status == 0) user.status = "Inativo";

    return user;
  });

  return users;
};
exports.adminQueries = {
  createUser,
  updateUserByUserEmail,
  getAllCalls,
  findAllCallsByUserIdAndType,
  getAllUsers,
};
