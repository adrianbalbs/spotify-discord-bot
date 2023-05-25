import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { getUserTopTracks } from "../spotify";
import { TopTracks } from "../types";
import { checkExistingDiscordUser } from "../handlers/commandHandlers";
import { getTimeRangeCategory } from "../helpers";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("toptracks")
    .setDescription("Show the top tracks from a user's Spotify account.")
    .addStringOption((option) =>
      option
        .setName("time-range")
        .setDescription("The time range of the user's top tracks")
        .setRequired(false)
        .addChoices(
          { name: "Monthly", value: "short_term" },
          { name: "Half-Yearly", value: "medium_term" },
          { name: "All-Time", value: "long_term" }
        )
    ),
  async execute(interaction: ChatInputCommandInteraction) {
    if (!(await checkExistingDiscordUser(interaction))) return;

    const timeRange = interaction.options.getString("time-range");
    const tracksEmbed = new EmbedBuilder().setColor("#1ed760");

    try {
      let topTracks: TopTracks[];

      if (timeRange !== null) {
        topTracks = await getUserTopTracks(interaction.user.id, timeRange);
      } else {
        topTracks = await getUserTopTracks(interaction.user.id);
      }

      const formattedTracks = topTracks
        .map((track, index) => {
          index++;
          const trackString = `${index}. [${track.name}](${track.trackUrl}) - **${track.artist}**`;
          return trackString;
        })
        .join("\n");

      const timeTitle = getTimeRangeCategory(timeRange);

      await interaction.reply({
        embeds: [
          tracksEmbed
            .setTitle(
              `**${interaction.user.username}'s Top Spotify Tracks - ${timeTitle}**`
            )
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
