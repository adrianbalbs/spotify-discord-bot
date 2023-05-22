import { PrismaClient } from "@prisma/client";
import 'dotenv/config';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export async function getUserTokenFromState(req: Request, res: Response) {
  const { state } = req.query;
  if (state) {
    const token = await prisma.token.findFirst({ 
      where: {
        ownedBy: state.toString(),
      }
    })
    res.json(token);
  } else {
    res.sendStatus(404);
  }
}

export async function registerDiscordUser(req: Request, res: Response) {
  try {
    console.log(req.body);
    const { discordId, username, state } = req.body;
    console.log('Hi');
    const discordUser = await prisma.user.create(
      { data: 
        { 
          discordId: discordId, 
          username: username, 
          state: state 
        }
      });

    console.log(discordUser);
    res.json(discordUser);
  } catch (err) {
    console.error(err);
    res.sendStatus(404);
  }
}

export async function getDiscordUser(req: Request, res: Response) {
  const { discordId } = req.query;
  if (discordId) {
    const discordUser = await prisma.user.findFirst({ 
      where: {
        discordId: discordId.toString()
      }
    });
    console.log(discordUser);
    res.json(discordUser);
  } else {
    res.sendStatus(404);
  }
}