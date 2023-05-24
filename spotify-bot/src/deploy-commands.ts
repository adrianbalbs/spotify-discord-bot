/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { REST, Routes } from "discord.js";
import "dotenv/config";
import fs from "fs";
import path from "path";

const { DISCORD_CLIENT_ID, DISCORD_GUILD_ID, DISCORD_BOT_TOKEN } = process.env;

const token = DISCORD_BOT_TOKEN;

async function main() {
  const commands: any[] = [];

  const commandsPath = path.join(__dirname, "commands");
  const commandFiles = fs
    .readdirSync(commandsPath)
    .filter((file) => file.endsWith(".ts"));

  for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = await import(filePath);
    if ("data" in command && "execute" in command) {
      commands.push(command.data.toJSON());
    } else {
      console.log(
        `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
      );
    }
  }

  const rest = new REST().setToken(token!);
  (async () => {
    try {
      console.log(`Started refreshing ${commands.length} application (/) commands.`);
      await rest.put(
        Routes.applicationGuildCommands(DISCORD_CLIENT_ID!, DISCORD_GUILD_ID!),
        { body: commands }
      );
      console.log(`Successfully reloaded application  commands.`);
    } catch (err) {
      console.error(err);
    }
  })();
}

main();
