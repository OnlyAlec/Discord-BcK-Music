require('dotenv').config();
// const fs = require('fs');
// const { REST } = require('@discordjs/rest');
// const { Routes } = require('discord-api-types/v9');

// module.exports = {
// 	async execute() {
// 		const commands = [];
// 		const commandFolders = fs.readdirSync('./commands');

// 		for (const folder of commandFolders) {
// 			const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
// 			for (const file of commandFiles) {
// 				const command = require(`.././commands/${folder}/${file}`);
// 				if(command.data.name != undefined) {
// 					commands.push(command.data.toJSON());
// 				}
// 			}
// 		}

// 		const rest = new REST({ version: '9' }).setToken(process.env.TOKEN);

// 		(async () => {
// 			console.log('Recargando las apliaciones (/).');
// 			try {
// 				await rest.put(
// 					Routes.applicationGuildCommands(process.env.CLIENTID, process.env.GUILDID),
// 					{ body: commands },
// 				);
// 				console.log('Satisfactorio!.');

// 			} catch (error) {
// 				console.error(error);
// 			}
// 		})();
// 	},
// };

module.exports = {
	async execute() {
		const {
			REST
		} = require("@discordjs/rest");
		const {
			Routes
		} = require("discord-api-types/v9");

		const commands = [{
			name: "play",
			description: "Reproduce una cancion!",
			options: [{
				name: "song",
				type: "3",
				description: "La cancion que quieres reproducir!",
				required: true
			}]
		}];

		const rest = new REST({
			version: "9"
		}).setToken(process.env.TOKEN);

		(async () => {
			try {
				console.log("Started refreshing application [/] commands.");

				await rest.put(
					Routes.applicationGuildCommands(process.env.CLIENTID, process.env.GUILDID), {
						body: commands
					},
				);

				console.log("Successfully reloaded application [/] commands.");
			} catch (error) {
				console.error(error);
			}
		})();
	}
}