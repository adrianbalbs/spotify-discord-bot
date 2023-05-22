"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('remove')
        .setDescription('Remove your Spotify Account from the Spotify Bot')
        .addStringOption(opt => opt
        .setName('confirm')),
    async execute(interaction) {
        // Narrow down the type as interaction is shared between context menu/slash commands
        if (interaction.type !== discord_js_1.InteractionType.ApplicationCommand)
            return;
        if (!interaction.isChatInputCommand())
            return;
        const confirm = interaction.options.getString('confirm');
        if (confirm !== null) {
            await interaction.reply('Removed Spotify Account from Spotify Bot');
        }
        else {
            await interaction.reply('Are you sure you want to remove your Spotify Account? type `/remove confirm` to confirm.');
        }
    }
};
