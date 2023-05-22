"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
require("dotenv/config");
const fs_1 = __importDefault(require("fs"));
const path_1 = __importDefault(require("path"));
const { DISCORD_BOT_TOKEN } = process.env;
async function main() {
    const client = new discord_js_1.Client({
        intents: [
            discord_js_1.GatewayIntentBits.Guilds
        ]
    });
    client.commands = new discord_js_1.Collection();
    const commandsPath = path_1.default.join(__dirname, 'commands');
    const commandFiles = fs_1.default.readdirSync(commandsPath).filter(file => file.endsWith('.ts'));
    for (const file of commandFiles) {
        const filePath = path_1.default.join(commandsPath, file);
        const command = await import(filePath);
        if ('data' in command && 'execute' in command) {
            client.commands.set(command.data.name, command);
        }
        else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    }
    client.on(discord_js_1.Events.InteractionCreate, async (interaction) => {
        if (!interaction.isChatInputCommand())
            return;
        const command = client.commands.get(interaction.commandName);
        if (!command)
            return;
        try {
            command.run(client, interaction);
        }
        catch (err) {
            console.error(err);
        }
    });
    client.once(discord_js_1.Events.ClientReady, c => {
        console.log(`Ready! Logged in as ${c.user.tag}`);
    });
    client.login(DISCORD_BOT_TOKEN);
}
main();
//# sourceMappingURL=index.js.map