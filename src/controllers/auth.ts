import { PrismaClient } from "@prisma/client";
import 'dotenv/config';
import { Request, Response } from 'express';
import axios from 'axios';
import url from 'url';

const { PORT, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET } = process.env;
const prisma = new PrismaClient();

export async function obtainAuthToken (req: Request, res: Response) {
  const { code, state } = req.query; 
  const basic = Buffer.from(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET).toString('base64');
  if (code && state) {
    try {
      const formData = new url.URLSearchParams({
        grant_type: 'authorization_code',
        code: code.toString(),
        redirect_uri: `http://localhost:${PORT}/api/redirect`
      });

      const response = await axios.post(
        'https://accounts.spotify.com/api/token',
        formData.toString(),
        {
          headers: {
            'Authorization': 'Basic ' + basic,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      
      // Store authorized user into the database
      const { access_token, refresh_token } = response.data;

      // Temporary user insertion to respect foreign key restrains, will actually be added in the discord bot itself first
      //const user = await prisma.user.create({ data: { id: state.toString(), discordID: parseInt(state.toString()) }})
      //console.log(user);
      const token = await prisma.token.create({ data: { accessToken: access_token, refreshToken: refresh_token, ownedBy: state.toString() } });
      res.json(token);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  } else {
    res.sendStatus(404);
  }
}
