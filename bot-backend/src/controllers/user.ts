
import { PrismaClient } from "@prisma/client";
import 'dotenv/config';
import { Request, Response } from 'express';

const prisma = new PrismaClient();

export async function getUserTokenFromState(req: Request, res: Response) {
  const state  = req.query.state as string;
  const token = await prisma.token.findFirst({ 
    where: {
      ownedBy: state.toString(),
    }
  })
  res.json(token);
} 

export async function registerDiscordUser(req: Request, res: Response) {
  try {
    const { discordId, username, state } = req.body;
    const discordUser = await prisma.user.create({ 
      data: { 
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
  const discordId = req.query.discordId as string;
  const discordUser = await prisma.user.findFirst({ 
    where: {
      discordId: discordId
    }
  });
  console.log(discordUser);
  res.json(discordUser);
}

export async function removeUserAndToken(req: Request, res: Response) {
  const discordId = req.query.discordId as string;
  console.log(discordId);
  try {
    const deleteUser = await prisma.user.delete({
      where: {
        discordId: discordId
      },
      select: {
        state: true,
      }
    });
  
    const deleteToken = await prisma.token.delete({
      where: {
        ownedBy: deleteUser.state
      },
      select: {
        accessToken: true,
        refreshToken: true,
        ownedBy: true
      }
    });
    
    console.log(deleteToken);
    res.sendStatus(200);
  } catch (err) {
    res.sendStatus(400);
  }

}