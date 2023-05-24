import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import axios from "axios";
import url from "url";

const { SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;
const prisma = new PrismaClient();

export async function refreshAcessToken(refresh_token: string, id: number) {
  try {
    const basic = Buffer.from(
      SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET
    ).toString("base64");
    const formData = new url.URLSearchParams({
      grant_type: "refresh_token",
      refresh_token: refresh_token,
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
    const updateToken = await prisma.token.update({
      where: { id: id },
      data: { accessToken: access_token },
    });
    console.log(updateToken);
    return { access_token: access_token };
  } catch (err) {
    throw new Error(err);
  }
}
