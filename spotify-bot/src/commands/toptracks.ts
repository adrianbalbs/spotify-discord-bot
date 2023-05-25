import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { getDiscordUser, getUserTopTracks } from "../spotify";
import { TopTracks } from "../types";
import { checkExistingDiscordUser } from "../handlers/commandHandlers";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("toptracks")
    .setDescription("Show the top tracks from a user's Spotify account."),
  async execute(interaction: CommandInteraction) {
    if (!(await checkExistingDiscordUser(interaction))) return;

    const tracksEmbed = new EmbedBuilder().setColor("#1ed760");
    try {
      const topTracks: TopTracks[] = await getUserTopTracks(
        interaction.user.id
      );
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
    } catch (err) {
      await interaction.reply({
        embeds: [
          tracksEmbed.setDescription(
            "An error has occured while trying to process this command."
          ),
        ],
      });
    }
  },
};
