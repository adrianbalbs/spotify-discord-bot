import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { generateRandomString } from "../helpers";
import { getDiscordUser, getUserTokenAndStore } from "../spotify";
const { SPOTIFY_CLIENT_ID } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName('login')
		.setDescription('Register a Spotify Account.'),
	async execute(interaction: CommandInteraction) {
		const state = generateRandomString(16);
		const link = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=http://localhost:3000/api/redirect&scope=user-top-read&state=${state}`;
		const user = await getDiscordUser(interaction.user.id);
		console.log(user);
		if (!user) {
			await interaction.reply(`Sign into Spotify here: ${link}`);
			const res = await getUserTokenAndStore(state, interaction.user.id, interaction.user.username);
			if (res) {
				await interaction.followUp('Login Successful!');
			} else {
				await interaction.followUp('Login timed out');
			}
		} else {
			await interaction.reply('You have already signed in to Spotify');
		}
	},
}
