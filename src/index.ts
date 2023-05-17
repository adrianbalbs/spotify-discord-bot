import { PrismaClient } from '@prisma/client'
import 'dotenv/config'
import express, { Request, Response } from 'express';
import axios from 'axios';
import url from 'url';

const PORT = process.env.PORT;

const prisma = new PrismaClient();
const app = express();


// Once I'm writing my discord bot, maybe split this up? 
app.get('/callback', async (req: Request, res: Response) => {
  const { code, state } = req.query; 
  const basic = Buffer.from(process.env.SPOTIFY_CLIENT_ID + ":" + process.env.SPOTIFY_CLIENT_SECRET).toString('base64');
  if (code && state) {
    try {
      const formData = new url.URLSearchParams({
        grant_type: 'authorization_code',
        code: code.toString(),
        redirect_uri: `http://localhost:${PORT}/callback`
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
      console.log(response.data)
      const { access_token, refresh_token } = response.data;
      const user = await prisma.user.create({ data: { accessToken: access_token, refreshToken: refresh_token, discord_id: parseInt(state.toString()) }});
      console.log(Number(user.discord_id));
      res.sendStatus(200);
    } catch (err) {
      console.log(err);
      res.sendStatus(400);
    }
  }
});

app.listen(PORT, () => console.log(`App listening at http://localhost:${PORT}`));
