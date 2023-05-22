import { Events, GatewayIntentBits } from 'discord.js';
import MyClient from './types';
import 'dotenv/config';
import fs from 'fs';
import path from 'path';

const { DISCORD_BOT_TOKEN } = process.env;

async function main() {
  const client = new MyClient(
    {
      intents: [
        GatewayIntentBits.Guilds
      ]
    }
  )

  // Import the slash commands 
  const commandsPath = path.join(__dirname, 'commands');
  const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);

    if ('data' in command && 'execute' in command) {
      client.commands.set(command.data.name, command)
    } else {
      console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
  }

  // Handle slash commands
  client.on(Events.InteractionCreate, async interaction => {
    if (!interaction.isChatInputCommand()) return;
    const command = client.commands.get(interaction.commandName);

    if (!command) return;
    
    try {
      command.execute(interaction);
    } catch (err) {
      console.error(err);
    }
  });

  client.once(Events.ClientReady, c => {
    console.log(`Ready! Logged in as ${c.user.tag}`);
  });

  client.login(DISCORD_BOT_TOKEN);
}

main();


