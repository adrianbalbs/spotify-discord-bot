import { PrismaClient, Token } from "@prisma/client";
import "dotenv/config";
import axios from "axios";
import url from "url";

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;
const prisma = new PrismaClient();

async function refreshAcessToken(refreshToken: string, id: number) {
  try {
    const basic = Buffer.from(
      SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET
    ).toString("base64");
    const formData = new url.URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refreshToken,
    });

    const res = await axios.post(
      "https://accounts.spotify.com/api/token",
      formData.toString(),
      {
        headers: {
          Authorization: "Basic " + basic,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const { access_token } = res.data;

    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const updateToken = await prisma.token.update({
      where: { id: id },
      data: { accessToken: access_token, expiresAt: expiresAt },
    });

    console.log(updateToken);
    return updateToken;
  } catch (err) {
    throw new Error(err);
  }
}

export async function checkAndRefreshAccessToken(token: Token) {
  const currTime = new Date();

  if (currTime >= token.expiresAt) {
    try {
      const newToken = await refreshAcessToken(token.refreshToken, token.id);
      return newToken;
    } catch (err) {
      throw new Error(err);
    }
  }

  return token;
}
