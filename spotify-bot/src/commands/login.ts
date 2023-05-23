import { CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { generateRandomString } from "../helpers";
import { getDiscordUser, getUserTokenAndStore } from "../spotify";
const { SPOTIFY_CLIENT_ID } = process.env;

module.exports = {
  data: new SlashCommandBuilder()
    .setName("login")
    .setDescription("Register a Spotify Account."),
  async execute(interaction: CommandInteraction) {
    const state = generateRandomString(16);
    const link = `https://accounts.spotify.com/authorize?client_id=${SPOTIFY_CLIENT_ID}&response_type=code&redirect_uri=http://localhost:3000/api/redirect&scope=user-top-read&state=${state}`;
    const user = await getDiscordUser(interaction.user.id);

    const loginEmbed = new EmbedBuilder().setColor("#1ed760").setURL(link);

    if (!user) {
      loginEmbed.setDescription(`Sign in to spotify with [this link](${link}) \
			If you do not have a Spotify account you can register for one [here](https://spotify.com/signup)`);
      await interaction.reply({ embeds: [loginEmbed] });
      const res = await getUserTokenAndStore(
        state,
        interaction.user.id,
        interaction.user.username
      );
      if (res) {
        await interaction.followUp({
          embeds: [loginEmbed.setDescription("Spotify Account has been linked!")],
        });
      } else {
        await interaction.followUp({
          embeds: [
            loginEmbed.setDescription(
              "Login has timed out, please try run the `/login` command again."
            ),
          ],
        });
      }
    } else {
      await interaction.reply({
        embeds: [loginEmbed.setDescription("You have already signed in to Spotify.")],
      });
    }
  },
};
