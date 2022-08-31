const  image_finder  =  require("image-search-engine")
const { SlashCommandBuilder } = require('discord.js');

async  function  printUrl(query){
	console.log(await  image_finder.find(query))
}

module.exports = {
    // Build the new slash command.
	data: new SlashCommandBuilder()
		.setName('hotdog')
		.setDescription('Picture of hotdog'),
        
    // The reaction to the command being run.
	async execute(interaction) {
		await interaction.reply(await image_finder.find("hotdog", {color: "transparent"}));
	},
};