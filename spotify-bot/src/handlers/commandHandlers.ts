import {
  CommandInteraction,
  EmbedBuilder,
  ButtonBuilder,
  ActionRowBuilder,
  ButtonStyle,
} from "discord.js";
import { getDiscordUser } from "../spotify";

export async function checkExistingDiscordUser(
  interaction: CommandInteraction
) {
  const embed = new EmbedBuilder().setColor("#1ed760");

  if (!(await getDiscordUser(interaction.user.id))) {
    await interaction.reply({
      embeds: [
        embed.setDescription(
          "You have not linked your Spotify Account to our bot. \
        Please use `/login` to link your Account with our bot."
        ),
      ],
      ephemeral: true,
    });
    return false;
  }
  return true;
}

export function buildConfirmAndDenyButtons() {
  const confirm = new ButtonBuilder()
    .setCustomId("confirm")
    .setLabel("Confirm")
    .setStyle(ButtonStyle.Danger);

  const cancel = new ButtonBuilder()
    .setCustomId("cancel")
    .setLabel("Cancel")
    .setStyle(ButtonStyle.Secondary);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
    cancel,
    confirm
  );

  return row;
}
