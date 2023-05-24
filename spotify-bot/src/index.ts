import { GatewayIntentBits } from "discord.js";
import MyClient from "./types";
import "dotenv/config";
import fs from "fs";
import path from "path";

const { DISCORD_BOT_TOKEN } = process.env;

async function main() {
  const client = new MyClient({
    intents: [GatewayIntentBits.Guilds],
  });

  // Import the slash commands
  const commandsPath = path.join(__dirname, "commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".ts"));
  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);

    if ("data" in command && "execute" in command) {
      client.commands.set(command.data.name, command);
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }

  // Import and run events
  const eventsPath = path.join(__dirname, "events");
  const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".ts"));

  for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = await import(filePath);

    if (event.once) {
      client.once(event.name, (...args) => event.execute(...args));
    } else {
      client.on(event.name, (...args) => event.execute(...args));
    }
  }

  client.login(DISCORD_BOT_TOKEN);
}

main();
