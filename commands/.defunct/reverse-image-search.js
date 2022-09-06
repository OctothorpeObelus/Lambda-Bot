const { SlashCommandBuilder } = require('discord.js');
const google = require('googlethis');
const request = require('request');

module.exports = {
    // Build the new slash command.
	data: new SlashCommandBuilder()
		.setName('reverse-image-search')
		.setDescription('Find the potential source of a provided image.')
        .addStringOption(option => option.setName('url').setDescription('URL of the image to reverse search.'))
        .addAttachmentOption(option => option.setName('attachment').setDescription('Upload the image to reverse search.')),
        
    // The reaction to the command being run.
	async execute(interaction) {
        const maxResults = 10; // Maximum displayed results

        const imageURLInput = interaction.options.getString('url');
        const attachmentInput = interaction.options.getAttachment('attachment');
        let imageUrl;

        // Input validation.
        if (imageURLInput) {
            await request(imageURLInput, function(error, response, body){
                if(!error && response.statusCode == 200 && ((response.headers['content-type']).match(/(image)+\//g)).length != 0){
                    /*  RESPONSE SUCCESS  */
                    imageUrl = imageURLInput;
                } else if (attachmentInput && attachmentInput.contentType.substring(0, 5) == 'image') {
                    /*  RESPONSE ERROR    */
                    // Check for attachment upload.
                    imageUrl = attachmentInput.url;
                } else {// If they didn't follow basic instructions.
                    interaction.reply({ content: 'You must specify either an image URL or upload an image to reverse search!', ephemeral: true });
                    return;
                }
            })
        } else if (attachmentInput && attachmentInput.contentType.substring(0, 5) == 'image') {
            imageUrl = attachmentInput.url;
        } else {// If they didn't follow basic instructions.
            await interaction.reply({ content: 'You must specify either an image URL or upload an image to reverse search!', ephemeral: true });
            return;
        }

        try {
            const reverse = await google.image(imageUrl, { ris: true });
            const numResults = (reverse.results.count <= maxResults) ? reverse.results.count : maxResults;

            const risEmbed = new EmbedBuilder()
                .setColor(0x87EFB6)
                .setTitle('Reverse Image Search Results')
                .setDescription('WARNING! Links returned are the result of an API, and that API does filter out potentially harmful sites, though it isn\'t perfect. Take caution.')
                .setThumbnail(imageUrl)
                .setTimestamp()

            // Add all the results we obtained 
            for (i = 0; i < numResults; i++) {
                risEmbed.addFields({ name: reverse.results[i]['title'], url: reverse.results[i]['url'], inline: false });
            }

            await interaction.reply({ embeds: [risEmbed] });
        } catch (error) {
            console.log(error);
            await interaction.reply({ content: 'No results found for your image input.', ephemeral: true });
        }
	},
};