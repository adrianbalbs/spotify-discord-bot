import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { getDiscordUser, getUserTopTracks } from "../spotify";
import { TopTracks } from "../types";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("toptracks")
    .setDescription("Show the top tracks from a user's Spotify account."),
  async execute(interaction: CommandInteraction) {
    const tracksEmbed = new EmbedBuilder().setColor("#1ed760");
    if (!(await getDiscordUser(interaction.user.id))) {
      await interaction.reply({
        embeds: [
          tracksEmbed.setDescription(
            "You have not linked your Spotify Account to our bot. \
        Please use `/login` to link your Account with our bot."
          ),
        ],
      });
      return;
    }
    const topTracks: TopTracks[] = await getUserTopTracks(interaction.user.id);
    const formattedTracks = topTracks
      .map((track, index) => {
        index++;
        const trackString = `${index}. ${track.name} - **${track.artist}**`;
        return trackString;
      })
      .join("\n");

    await interaction.reply({
      embeds: [
        tracksEmbed
          .setTitle(`**${interaction.user.username}'s Top Spotify Tracks**`)
          .setThumbnail(interaction.user.avatarURL())
          .setDescription(formattedTracks),
      ],
    });
  },
};
