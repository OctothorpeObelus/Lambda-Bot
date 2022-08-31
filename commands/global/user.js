const { SlashCommandBuilder } = require('discord.js');

module.exports = {
    // Build the new slash command.
	data: new SlashCommandBuilder()
		.setName('user')
		.setDescription('Replies with user info!'),
        
    // The reaction to the command being run.
	async execute(interaction) {
		await interaction.reply(`Your tag: ${interaction.user.tag}\nYour id: ${interaction.user.id}`);
	},
};