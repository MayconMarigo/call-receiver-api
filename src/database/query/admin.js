const { User } = require("../../../models");
const Crypto = require("crypto");
const { CryptoUtils } = require("../../utils/encryption");

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

const updateUserById = async (payload) => {
  const { id, name, email, phone, password, userTypeId } = payload;

  const updated = await User.update(
    { phone, password },
    {
      where: { id },
    }
  );

  return created;
};

exports.adminQueries = { createUser, updateUserById };
