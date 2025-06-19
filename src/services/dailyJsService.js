require("dotenv").config();
const { BASE_DAILY_JS_URL } = require("../utils/constants");

const commomHeaders = {
  "content-type": "application/json",
};

exports.generateTokenByRoomName = async (
  roomName,
  userName,
  isAdmin = false
) => {
  const request = await fetch(`${BASE_DAILY_JS_URL}/meeting-tokens`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.DAILY_JS_API_KEY}`,
      ...commomHeaders,
    },
    body: JSON.stringify({
      properties: {
        exp: new Date().getTime() + 3600 * 1000,
        room_name: roomName || crypto.randomUUID(),
        user_name: userName,
        is_owner: isAdmin,
      },
    }),
  });

  const { token } = await request.json();

  return token;
};

exports.generateAdminRoomName = async (roomName) => {
  const request = await fetch(`${BASE_DAILY_JS_URL}/rooms`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.DAILY_JS_API_KEY}`,
      ...commomHeaders,
    },
    body: JSON.stringify({
      name: roomName,
      privacy: "private",
      properties: {
        eject_at_room_exp: true,
        enable_prejoin_ui: false,
        max_participants: 2,
        exp: Math.floor(Date.now() / 1000) + 3600,
      },
    }),
  });

  const { id, name } = await request.json();

  return { id, name };
};
