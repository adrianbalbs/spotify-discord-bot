import { PrismaClient } from "@prisma/client";
import "dotenv/config";
import { NextFunction, Request, Response } from "express";
import assertIsDefined from "../helpers/assertIsDefined";
import { checkAndRefreshAccessToken } from "../helpers/token";
import axios from "axios";
import { getTopTrackNames } from "../helpers/spotifyHelpers";
const prisma = new PrismaClient();

export async function getUserTokenFromState(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { state } = req.query;
  try {
    assertIsDefined(state);

    const token = await prisma.token.findFirst({
      where: {
        ownedBy: state.toString(),
      },
    });
    res.json(token);
  } catch (err) {
    console.log(err);
    next(err);
  }
}

export async function registerDiscordUser(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { discordId, username, state } = req.body;
    const discordUser = await prisma.user.create({
      data: {
        discordId: discordId,
        username: username,
        state: state,
      },
    });

    console.log(discordUser);
    res.json(discordUser);
  } catch (err) {
    console.error(err);
    next(err);
  }
}

export async function getDiscordUser(req: Request, res: Response, next: NextFunction) {
  const { discordId } = req.query;
  try {
    assertIsDefined(discordId);

    const discordUser = await prisma.user.findFirst({
      where: {
        discordId: discordId as string,
      },
    });

    console.log(discordUser);
    res.json(discordUser);
  } catch (err) {
    console.log(err);
    next(err);
  }
}

export async function removeUserAndToken(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { discordId } = req.query;

  try {
    assertIsDefined(discordId);

    const deleteUser = await prisma.user.delete({
      where: {
        discordId: discordId as string,
      },
      select: {
        state: true,
      },
    });

    const deleteToken = await prisma.token.delete({
      where: {
        ownedBy: deleteUser.state,
      },
      select: {
        accessToken: true,
        refreshToken: true,
        ownedBy: true,
      },
    });

    console.log(deleteToken);
    res.sendStatus(200);
  } catch (err) {
    console.log(err);
    next(err);
  }
}

// Use this as the model for how we make API calls to Spotify
export async function testTokenRefresh(req: Request, res: Response, next: NextFunction) {
  const { discordId } = req.query;
  try {
    assertIsDefined(discordId);

    const discordUser = await prisma.user.findFirst({
      where: {
        discordId: discordId as string,
      },
      include: {
        token: true,
      },
    });

    // If the token does not need to be refreshed we return the old token from the fucntion
    // We also assert null as we check if the user is in the databse from the bot itself before making the call
    discordUser!.token = await checkAndRefreshAccessToken(discordUser!.token);

    res.json(discordUser!.token);
  } catch (err) {
    console.log(err);
    next(err);
  }
}

export async function getTopTracks(req: Request, res: Response, next: NextFunction) {
  const { discordId } = req.query;
  try {
    assertIsDefined(discordId);

    let discordUser = await prisma.user.findFirst({
      where: {
        discordId: discordId as string,
      },
      include: {
        token: true,
      },
    });

    // If the token does not need to be refreshed we return the old token from the fucntion
    // We also assert null as we check if the user is in the databse from the bot itself before making the call
    discordUser!.token = await checkAndRefreshAccessToken(discordUser!.token);

    const topTracks = await axios.get(
      "https://api.spotify.com/v1/me/top/tracks?limit=10",
      {
        headers: {
          Authorization: "Bearer " + discordUser!.token.accessToken,
        },
      }
    );

    const resTracks = getTopTrackNames(topTracks.data);
    res.json(resTracks);
  } catch (err) {
    console.log(err);
    next(err);
  }
}
