import { Events } from 'discord.js';
import MyClient from '../types';

module.exports = {
  name: Events.ClientReady,
  once: true,
  execute(client: MyClient) {
    if (client.user === null || client.user === undefined) {
      throw Error('Expected client user not be null but recieved null');
    }
    console.log(`Ready! Logged in as ${client.user.tag}`);
  }
}