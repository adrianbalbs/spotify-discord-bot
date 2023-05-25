import {
  ChatInputCommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { getUserTopArtists } from "../spotify";
import { TopArtists } from "../types";
import { checkExistingDiscordUser } from "../handlers/commandHandlers";
import { getTimeRangeCategory } from "../helpers";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("topartists")
    .setDescription("Show the top artists from a user's Spotify account.")
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
    const artistsEmbed = new EmbedBuilder().setColor("#1ed760");

    try {
      let topArtists: TopArtists[];

      if (timeRange !== null) {
        topArtists = await getUserTopArtists(interaction.user.id, timeRange);
      } else {
        topArtists = await getUserTopArtists(interaction.user.id);
      }

      const formattedTracks = topArtists
        .map((artist, index) => {
          index++;
          const trackString = `${index}. **[${artist.artistName}](${artist.url})**`;
          return trackString;
        })
        .join("\n");

      const timeTitle = getTimeRangeCategory(timeRange);

      await interaction.reply({
        embeds: [
          artistsEmbed
            .setTitle(
              `**${interaction.user.username}'s Top Spotify Artists - ${timeTitle}**`
            )
            .setThumbnail(interaction.user.avatarURL())
            .setDescription(formattedTracks),
        ],
      });
    } catch (err) {
      await interaction.reply({
        embeds: [
          artistsEmbed.setDescription(
            "An error has occured while trying to process this command."
          ),
        ],
      });
    }
  },
};
