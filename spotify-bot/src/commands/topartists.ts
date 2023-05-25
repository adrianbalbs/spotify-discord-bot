import {
  CommandInteraction,
  EmbedBuilder,
  SlashCommandBuilder,
} from "discord.js";
import { getUserTopArtists } from "../spotify";
import { TopArtists } from "../types";
import { checkExistingDiscordUser } from "../handlers/commandHandlers";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("topartists")
    .setDescription("Show the top artists from a user's Spotify account."),
  async execute(interaction: CommandInteraction) {
    if (!(await checkExistingDiscordUser(interaction))) return;

    const artistsEmbed = new EmbedBuilder().setColor("#1ed760");
    try {
      const topArtists: TopArtists[] = await getUserTopArtists(
        interaction.user.id
      );
      const formattedTracks = topArtists
        .map((artist, index) => {
          index++;
          const trackString = `${index}. **[${artist.artistName}](${artist.url})**`;
          return trackString;
        })
        .join("\n");

      await interaction.reply({
        embeds: [
          artistsEmbed
            .setTitle(`**${interaction.user.username}'s Top Spotify Artists**`)
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
