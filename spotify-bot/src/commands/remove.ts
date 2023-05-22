import { CommandInteraction, InteractionType, SlashCommandBuilder,  } from "discord.js";
import { removeDiscordUser } from "../spotify";


module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Remove your Spotify Account from the Spotify Bot')
    .addSubcommand(opt =>
      opt
        .setName('confirm')
        .setDescription('Confirm Spotify Account Removal')),
    async execute(interaction: CommandInteraction) {
      // Narrow down the type as interaction is shared between context menu/slash commands
      if (interaction.type !== InteractionType.ApplicationCommand) return;
      if (!interaction.isChatInputCommand()) return;
      const confirm = interaction.options.getSubcommand();

      if (confirm === 'confirm') {
        const res = await removeDiscordUser(interaction.user.id);
        if (res) {
          await interaction.reply('Removed Spotify Account from Spotify Bot');
        } else {
          await interaction.reply('Spotify Account removal failed');
        }
      } else if (confirm === null) {
        await interaction.reply('Are you sure you want to remove your Spotify Account? type `/remove confirm` to confirm.');
      } else {
        await interaction.reply('Not a valid option, please type `/confirm true` to confirm Spotify Account removal')
      }
    }
}