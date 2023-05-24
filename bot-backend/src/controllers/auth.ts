import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import axios from "axios";
import url from "url";
import assertIsDefined from "../helpers/assertIsDefined";
const { PORT, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;
const prisma = new PrismaClient();

export async function obtainAuthToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { code, state } = req.query;
  const basic = Buffer.from(
    SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET
  ).toString("base64");

  try {
    assertIsDefined(code);
    assertIsDefined(state);

    const formData = new url.URLSearchParams({
      grant_type: "authorization_code",
      code: code.toString(),
      redirect_uri: `http://localhost:${PORT}/api/redirect`,
    });

    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      formData.toString(),
      {
        headers: {
          Authorization: "Basic " + basic,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    // Store authorized user into the database
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1);

    const { access_token, refresh_token } = response.data;
    const token = await prisma.token.create({
      data: {
        accessToken: access_token,
        refreshToken: refresh_token,
        expiresAt: expiresAt,
        ownedBy: state.toString(),
      },
    });
    console.log(token);
    res.send("Spotify account linked, you can now close the browser!");
  } catch (err) {
    console.log(err);
    next(err);
  }
}
