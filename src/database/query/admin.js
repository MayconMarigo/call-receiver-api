const { User, Call } = require("../../../models");
const Crypto = require("crypto");
const { CryptoUtils } = require("../../utils/encryption");
const { Op } = require("@sequelize/core");
const { literal } = require("sequelize");
const { dateUtils } = require("../../utils/date");

const createUser = async (payload) => {
  const { name, email, phone, password, userTypeId } = payload;

  const secret2fa = CryptoUtils.generateBase32Hash();
  const [user, created] = await User.findOrCreate({
    where: { email },
    defaults: {
      id: Crypto.randomUUID(),
      name,
      email,
      phone,
      password,
      status: 1,
      userTypeId,
      secret2fa,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return created;
};

const updateUserByUserId = async (payload) => {
  const {
    userId,
    name,
    email,
    phone,
    password,
    status,
    logoImage,
    colorScheme,
  } = payload;

  const mountUpdatedPayloadWithoutNullables = () => {};

  // $2b$10$k4gFmLS2kYfYhEF46qQnFurvizqWEQOs6IgXn5j4c7sT.BFVcN90m

  const updated = await User.update(
    {
      name,
      email,
      phone,
      password,
      status,
      logoImage,
      colorScheme,
      updatedAt: new Date(),
    },
    {
      where: { id: userId },
    }
  );

  console.log(updated);

  return updated;
};

const findAllCalls = async (startDate, endDate) => {
  const reports = await Call.findAll({
    where: {
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
      [
        literal("TIMESTAMPDIFF(MINUTE, startTime, endTime)"),
        "durationInMinutes",
      ],
    ],
  });

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
      [
        literal("TIMESTAMPDIFF(MINUTE, startTime, endTime)"),
        "durationInMinutes",
      ],
    ],
  });

  return report;
};

exports.adminQueries = {
  createUser,
  updateUserByUserId,
  findAllCalls,
  findAllCallsByUserIdAndType,
};
