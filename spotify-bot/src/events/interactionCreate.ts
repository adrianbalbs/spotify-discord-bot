import { Events } from 'discord.js';

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction: any) {
    if (!interaction.isChatInputCommand()) return;
    const command = interaction.client.commands.get(interaction.commandName);

    if (!command) return;
    
    try {
      command.execute(interaction);
    } catch (err) {
      console.error(err);
    }
  }
}