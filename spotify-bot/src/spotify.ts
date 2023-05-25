import axios from "axios";
import { wait } from "./helpers";
import "dotenv/config";

const { PORT } = process.env;

// Maybe put local host as an .env variable so I don't hardcode it in for deployment

export async function getUserTokenAndStore(
  state: string,
  userId: string,
  user: string
) {
  let loginDelay = 8000;
  for (let i = 0; i < 11; i++) {
    await wait(loginDelay);
    const res = await getUserToken(state);
    console.log(res);

    if (res) {
      registerUser(state, userId, user);
      console.log(
        `Spotify user logged in with auth sesssion for ${user} ID: ${userId}`
      );
      return true;
    }
    if (!res && i == 10) {
      console.error(`Login timed out for ${user} ID: ${userId}`);
      return false;
    }

    if (!res) {
      loginDelay += 3000;
    }
  }

  return false;
}

async function getUserToken(state: string) {
  const res = await axios.get(`http://localhost:${PORT}/api/user/token`, {
    params: { state: state },
  });
  if (res.data === null) {
    return false;
  }
  return true;
}

export async function getDiscordUser(discordId: string) {
  const res = await axios.get(`http://localhost:${PORT}/api/user/discord`, {
    params: { discordId: discordId },
  });
  if (res.data === null) {
    return false;
  }
  return true;
}

export async function removeDiscordUser(discordId: string) {
  const res = await axios.delete(`http://localhost:${PORT}/api/user/remove`, {
    params: {
      discordId: discordId,
    },
  });
  console.log(res.data);
  if (res.data === "OK") {
    return true;
  } else {
    return false;
  }
}

async function registerUser(state: string, userId: string, user: string) {
  const response = await axios.post(
    `http://localhost:${PORT}/api/user/register`,
    {
      discordId: userId,
      username: user,
      state: state,
    },
    {
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  console.log(response.data);
}

export async function getUserTopTracks(discordId: string) {
  try {
    const res = await axios.get(`http://localhost:${PORT}/api/user/toptracks`, {
      params: { discordId: discordId },
    });
    return res.data.items;
  } catch (err) {
    console.log(err);
  }
}

export async function getUserTopArtists(discordId: string) {
  try {
    const res = await axios.get(
      `http://localhost:${PORT}/api/user/topartists`,
      {
        params: { discordId: discordId },
      }
    );
    return res.data.items;
  } catch (err) {
    console.log(err);
  }
}
