import { ActionRowBuilder, ButtonBuilder, ButtonStyle, CollectorFilter, CommandInteraction, EmbedBuilder, SlashCommandBuilder } from "discord.js";
import { removeDiscordUser } from "../spotify";


module.exports = {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setDescription('Remove your Spotify Account from the Spotify Bot'),
    async execute(interaction: CommandInteraction) {
      const confirm = new ButtonBuilder()
        .setCustomId('confirm')
        .setLabel('Confirm')
        .setStyle(ButtonStyle.Danger);
      
      const cancel = new ButtonBuilder()
        .setCustomId('cancel')
        .setLabel('Cancel')
        .setStyle(ButtonStyle.Secondary);
        
      const row = new ActionRowBuilder<ButtonBuilder>()
        .addComponents(cancel, confirm)

      const removalEmbed = new EmbedBuilder()
        .setColor('#1ed760')
        .setDescription('Are you sure you want to unlink your Spotify Account?');

      const response = await interaction.reply({ 
        embeds: [removalEmbed],
        components: [row],
        ephemeral: true,
      })

      const collectorFiler = (i: any) => i.user.id === interaction.user.id;
      try {
        const confirmation = await response.awaitMessageComponent({ filter: collectorFiler, time: 60000 })
        if (confirmation.customId === 'confirm') {
          const res = await removeDiscordUser(interaction.user.id);
          if (res) {
            await confirmation.update({ embeds: [removalEmbed.setDescription('Spotify Account successfully unlinked.')] });
          } else {
            await confirmation.update({ embeds: [removalEmbed.setDescription('Spotify Account was not successfully unlinked.')] });
          }
        } else if (confirmation.customId === 'cancel') {
          await confirmation.update({ embeds: [removalEmbed.setDescription('Spotify Account unlinking cancelled.')] });
        }
      } catch (err) {
        await interaction.followUp({ embeds: [removalEmbed.setDescription('Response timed out.')], ephemeral: true });
      }
    }
}