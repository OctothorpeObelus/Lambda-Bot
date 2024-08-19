const { SlashCommandBuilder } = require('discord.js');
const audioconcat = require('audioconcat');
const path = "./assets/sounds/vox/"
const fs = require('fs');

let valid_phrases = [];

// Fetch all valid phrases and put them into the valid_phrases table
fs.readdirSync(path).forEach(file => {
	valid_phrases.push( file.substring(0,file.length-4) );
});

module.exports = {
    // Build the new slash command.
	data: new SlashCommandBuilder()
		.setName('vox')
		.setDescription('Create sound files of the Half Life VOX Announcer')
		.addStringOption(option =>
			option.setName('input')
				.setDescription('The string input to turn into a vox file')
				.setRequired(true)),
        
    // The reaction to the command being run.
	async execute(interaction) {
		await interaction.deferReply();

		let string = interaction.options.getString('input').split(' ');
		let invalid_words = [];
		// Check that all strings entered are valid. If not, return an ephemeral error message with a list of invalid strings.
		string.forEach(word => {
			if (!valid_phrases.includes(word.toLowerCase())) {
				invalid_words.push(word.toLowerCase());
			}
		});
		for (let i = 0; i < string.length; i++) {
			string[i] = path + (string[i].toLowerCase()) + ".mp3";
		}
		console.log(string);

		// Error out if not all words are valid.
		if (invalid_words.length > 0) {
			if (invalid_words.length > 1) {
				await interaction.editReply({content: "'" + invalid_words.join('\', \'') + '\' are invalid words!', ephemeral: true});
			} else {
				await interaction.editReply({content: "'" + invalid_words.join(', ') + '\' is an invalid word!', ephemeral: true});
			}
			return;
		}

		// Create the concatenated audio file
		audioconcat(string)
			.concat("./assets/bot_output/vox_output.mp3")
			.on('end', function(output) {
				interaction.followUp({files: ["./assets/bot_output/vox_output.mp3"]});
			});
	},
};
