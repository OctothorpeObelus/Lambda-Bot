const fs = require('node:fs');
const path = require('node:path');
const { SlashCommandBuilder, Routes } = require('discord.js');
const { REST } = require('@discordjs/rest');
const { clientId, token } = require('./config.json');

function addCommands(cmdPath, guildId = "") {
	const commands = [];
	const commandsPath = path.join(__dirname, 'commands', cmdPath);
	const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

	for (const file of commandFiles) {
		const filePath = path.join(commandsPath, file);
		const command = require(filePath);
		commands.push(command.data.toJSON());
	}

	const rest = new REST({ version: '10' }).setToken(token);

	(async () => {
		try {
			console.log(`Started refreshing ${commands.length} ${cmdPath} application (/) commands.`);

			let data;
			if (guildId == "") {
				data = await rest.put(
					Routes.applicationCommands(clientId),
					{ body: commands },
				);
			} else {
				data = await rest.put(
					Routes.applicationGuildCommands(clientId, guildId),
					{ body: commands },
				);
			}

			console.log(`Successfully reloaded ${data.length} ${cmdPath} application (/) commands.`);
		} catch (error) {
			console.error(error);
		}
	})();
}

addCommands('global');