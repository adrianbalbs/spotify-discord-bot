import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import assertIsDefined from "../helpers/assertIsDefined";
import { checkAndRefreshAccessToken } from "../helpers/token";
import axios from "axios";
import { searchSpotifyTracks } from "../helpers/spotifyHelpers";

const prisma = new PrismaClient();

export async function getTrackTest(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { discordId, trackName } = req.query;

  try {
    assertIsDefined(discordId);
    assertIsDefined(trackName);
    console.log(trackName);
    let discordUser = await prisma.user.findFirst({
      where: {
        discordId: discordId as string,
      },
      include: {
        token: true,
      },
    });

    assertIsDefined(discordUser);

    discordUser.token = await checkAndRefreshAccessToken(discordUser.token);

    const track = await searchSpotifyTracks(
      trackName as string,
      discordUser.token.accessToken
    );

    res.json(track);
  } catch (err) {
    console.log(err);
    next(err);
  }
}
