const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    // Build the new slash command.
	data: new SlashCommandBuilder()
		.setName('server')
		.setDescription('Replies with server info!'),
        
    // The reaction to the command being run.
	async execute(interaction) {
		await interaction.reply(`Server name: ${interaction.guild.name}\nTotal members: ${interaction.guild.memberCount}`);
	},
};