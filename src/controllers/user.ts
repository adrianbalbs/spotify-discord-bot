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
    console.log(token);
    res.json(token);
  } else {
    res.sendStatus(404);
  }
}