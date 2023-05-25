import {
  CommandInteraction,
  EmbedBuilder,
  Interaction,
  SlashCommandBuilder,
} from "discord.js";
import { removeDiscordUser } from "../spotify";
import {
  buildConfirmAndDenyButtons,
  checkExistingDiscordUser,
} from "../handlers/commandHandlers";

module.exports = {
  data: new SlashCommandBuilder()
    .setName("remove")
    .setDescription("Remove your Spotify Account from the Spotify Bot"),
  async execute(interaction: CommandInteraction) {
    if (!(await checkExistingDiscordUser(interaction))) return;

    const row = buildConfirmAndDenyButtons();

    const removalEmbed = new EmbedBuilder()
      .setColor("#1ed760")
      .setDescription("Are you sure you want to unlink your Spotify Account?");

    const response = await interaction.reply({
      embeds: [removalEmbed],
      components: [row],
      ephemeral: true,
    });

    const collectorFiler = (i: Interaction) =>
      i.user.id === interaction.user.id;

    try {
      const confirmation = await response.awaitMessageComponent({
        filter: collectorFiler,
        time: 60000,
      });
      if (confirmation.customId === "confirm") {
        const res = await removeDiscordUser(interaction.user.id);
        if (res) {
          await confirmation.update({
            embeds: [
              removalEmbed.setDescription(
                "Spotify Account successfully unlinked."
              ),
            ],
          });
        } else {
          await confirmation.update({
            embeds: [
              removalEmbed.setDescription(
                "Spotify Account was not successfully unlinked."
              ),
            ],
          });
        }
      } else if (confirmation.customId === "cancel") {
        await confirmation.update({
          embeds: [
            removalEmbed.setDescription("Spotify Account unlinking cancelled."),
          ],
        });
      }
    } catch (err) {
      await interaction.followUp({
        embeds: [removalEmbed.setDescription("Response timed out.")],
        ephemeral: true,
      });
    }
  },
};
