"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const helpers_1 = require("../helpers");
const spotify_1 = require("../spotify");
const { SPOTIFY_CLIENT_ID } = process.env;
module.exports = {
    data: new discord_js_1.SlashCommandBuilder()
        .setName('login')
        .setDescription('Register a Spotify Account.'),
    async execute(interaction) {
        const state = (0, helpers_1.generateRandomString)(16);
        const link = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=http://localhost:3000/api/redirect&scope=user-top-read&state=${state}`;
        const user = await (0, spotify_1.getDiscordUser)(interaction.user.id);
        console.log(user);
        if (!user) {
            await interaction.reply(`Sign into Spotify here: ${link}`);
            const res = await (0, spotify_1.getUserTokenAndStore)(state, interaction.user.id, interaction.user.username);
            if (res) {
                await interaction.followUp('Login Successful!');
            }
            else {
                await interaction.followUp('Login timed out');
            }
        }
        else {
            await interaction.reply('You have already signed in to Spotify');
        }
    },
};
