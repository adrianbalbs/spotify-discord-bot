const express = require('express');
const app = express()
const { Client, Events, GatewayIntentBits } = require('discord.js');
const { token, client_id, client_secret, port } = require('./config.json');
const axios = require('axios');
const url = require('url');

// Create a new client instance
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

// When the client is ready, run this code (only once)
// We use 'c' for the event parameter to keep it separate from the already defined 'client'
client.once(Events.ClientReady, c => {
	console.log(`Ready! Logged in as ${c.user.tag}`);
});

app.get('/callback', async (request, response) => {
  const { code } = request.query;
  const basic = Buffer.from(client_id + ":" + client_secret).toString('base64');

  if (code) {
    try {
      const formData = new url.URLSearchParams({
          grant_type: 'authorization_code',
          code: code.toString(),
          redirect_uri: 'http://localhost:3000/callback'
        });

      const res = await axios.post(
        'https://accounts.spotify.com/api/token',
        formData.toString(),
        {
          headers: {
            'Authorization': 'Basic ' + basic,
            'Content-Type': 'application/x-www-form-urlencoded'
          }
        }
      );
      const { access_token, refresh_token } = res.data;
      const accessToken = access_token;
      const refreshToken = refresh_token;
      console.log({
        accessToken: accessToken,
        refreshToken: refreshToken,
      });
      localStorage.setItem('accessToken', accessToken)
      response.sendStatus(200);
    } catch (err) {
      console.log(err);
      response.sendStatus(400);
    }
  }
});


// Log in to Discord with your client's token
client.login(token);

app.listen(port, () => console.log(`App listening at http://localhost:${port}`));
