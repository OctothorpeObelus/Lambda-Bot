const { SlashCommandBuilder } = require('discord.js');
const google = require('googlethis');
const utils = require('../../lib/utils.js');

module.exports = {
    // Build the new slash command.
	data: new SlashCommandBuilder()
		.setName('serval')
		.setDescription('Random picture of a serval'),
        
    // The reaction to the command being run.
	async execute(interaction) {
        const images = await google.image('Serval Cat', { safe: true });
        const imgUrl = images[utils.randInt(images.length)]['url'];
        console.log(imgUrl)
		await interaction.reply(imgUrl);
	},
};