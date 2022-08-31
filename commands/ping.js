const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    // Build the new slash command.
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('Replies with Pong!'),
        
    // The reaction to the command being run.
	async execute(interaction) {
		await interaction.reply('Pong!');
	},
};