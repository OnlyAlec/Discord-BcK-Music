const fs = require('fs');
const {
    Client,
    Intents
} = require("discord.js");
require('dotenv').config();
const BcK = new Client({
    intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_VOICE_STATES]
});
const {
    Player
} = require("discord-player");
const player = new Player(BcK);


const eventFiles = fs.readdirSync('./events').filter(file => file.endsWith('.js'));
for (const file of eventFiles) {
    const event = require(`./events/${file}`);
    if (event.once) {
        BcK.once(event.name, (...args) => event.execute(...args, BcK));
    } else {
        BcK.on(event.name, (...args) => event.execute(...args, BcK));
    }
}

player.on("trackStart", (queue, track) => queue.metadata.channel.send(`🎶 | Reproduciendo... **${track.title}**!`))

BcK.on("interactionCreate", async (interaction) => {
    if (!interaction.isCommand()) return;

    // Play
    if (interaction.commandName === "play" || interaction.commandName === "p" ) {
        // Checa si esta en VC
        if (!interaction.member.voice.channelId) return await interaction.reply({
            content: "No estas conectado a un canal de voz!",
            ephemeral: true
        });
        // Checa si esta en el mismo VC
        if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) return await interaction.reply({
            content: "No esta en el mismo canal de voz!",
            ephemeral: true
        });

        // Run
        const song = interaction.options.get("song").value;
        const queue = player.createQueue(interaction.guild, {
            metadata: {
                channel: interaction.channel
            }
        });

        // VC connection
        try {
            if (!queue.connection) await queue.connect(interaction.member.voice.channel);
        } catch {
            queue.destroy();
            return await interaction.reply({
                content: "No me puedo unir a tu canal!",
                ephemeral: true
            });
        }

        await interaction.deferReply();
        const track = await player.search(song, {
            requestedBy: interaction.user
        }).then(x => x.tracks[0]);
        if (!track) return await interaction.followUp({
            content: `❌ | No puede encontrar: **${song}** !`
        });

        queue.play(track);

        return await interaction.followUp({
            content: `⏱️ | Cargando cancion... **${track.title}**!`
        });
    }
});

//Log In
    console.log('MUSIC     Log-in ...\n');
    BcK.login(process.env.TOKEN);