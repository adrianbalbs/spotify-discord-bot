import axios from 'axios';
import { wait } from './helpers';

export async function getUserTokenAndStore(state: string, userId: string, user: string) {

  let loginDelay = 8000;
  for (let i = 0; i < 11; i++) {
    await wait(loginDelay);
    const res = await getUserToken(state);
    console.log(res);

    if (res) {
      registerUser(state, userId, user);
      console.log(`Spotify user logged in with auth sesssion for ${user} ID: ${userId}`);
      return true;
    }
    if (!res && i == 10) {
      console.error(`Login timed out for ${user} ID: ${userId}`)
      return false
    }

    if (!res) {
      loginDelay += 3000;
    }
  }
  
  return false;
}

async function getUserToken(state: string) {
  const res = await axios.get('http://localhost:3000/api/user/token', {params: {state: state }})
  if (res.data === null) {
    return false;
  }
  return true;

}

export async function getDiscordUser(discordId: string) {
  const res = await axios.get('http://localhost:3000/api/user/discord', {params: {discordId: discordId }})
  if (res.data === null) {
    return false;
  } 
  return true;
}

export async function removeDiscordUser(discordId: string) {
  const res = await axios.delete('http://localhost:3000/api/user/remove', {
    params: {
      discordId: discordId
    }
  })
  if (res.data == 'OK') {
    return true;
  } else {
    return false;
  }
}

async function registerUser(state: string, userId: string, user: string) {
  const response = await axios.post(
    'http://localhost:3000/api/user/register',
    {
      discordId: userId,
      username: user,
      state: state,
    },
    {
      headers: {
        'Content-Type': 'application/json'
      }
    }
  );
  console.log(response.data);
}