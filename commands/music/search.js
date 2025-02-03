const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { QueryType, useMainPlayer } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'search',
    description: '搜尋音樂',
    voiceChannel: true,
    options: [
        {
            name: 'song',
            description:('您要搜尋的音樂'),
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    async execute({ client, inter }) {
        const player = useMainPlayer();
        const song = inter.options.getString('song');

        const res = await player.search(song, {
            requestedBy: inter.member,
            searchEngine: QueryType.AUTO
        });

        if (!res?.tracks.length) return inter.editReply({ content: await Translate(`沒有找到結果 <${inter.member}>... 再試一次？ <❌>`) });

        const queue = player.nodes.create(inter.guild, {
            metadata: {
             channel: inter.channel
                    },
            spotifyBridge: client.config.opt.spotifyBridge,
            volume: client.config.opt.defaultvolume,
            leaveOnEnd: client.config.opt.leaveOnEnd,
            leaveOnEmpty: client.config.opt.leaveOnEmpty
        });
        const maxTracks = res.tracks.slice(0, 10);

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setAuthor({ name: await Translate(`Results for <${song}>`), iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) })
            .setDescription(await Translate(`<${maxTracks.map((track, i) => `**${i + 1}**. ${track.title} | ${track.author}`).join('\n')}\n\n> 在 <**1**> 和 <**${maxTracks.length}**> 或 <**cancel** ⬇️> 之間選擇`))
            .setTimestamp()
            .setFooter({ text: await Translate('音樂至上 - 社群用心製作 <❤️>'), iconURL: inter.member.avatarURL({ dynamic: true }) })

        inter.editReply({ embeds: [embed] });

        const collector = inter.channel.createMessageCollector({
            time: 15000,
            max: 1,
            errors: ['time'],
            filter: m => m.author.id === inter.member.id
        });

        collector.on('collect', async (query) => {
            collector.stop();
            if (query.content.toLowerCase() === 'cancel') {
                return inter.followUp({ content: await Translate(`搜尋已取消 <✅>`), ephemeral: true });
            }

            const value = parseInt(query);
            if (!value || value <= 0 || value > maxTracks.length) {
                return inter.followUp({ content: await Translate(`無效回應，請嘗試 <**1**> 和 <**${maxTracks.length}**> 或 <**cancel**>... 再試一次？ <❌>`), ephemeral: true });
            }

            try {
                if (!queue.connection) await queue.connect(inter.member.voice.channel);
            } catch {
                await player.deleteQueue(inter.guildId);
                return inter.followUp({ content: await Translate(`我無法加入語音頻道 <${inter.member}>... 再試一次？ <❌>`), ephemeral: true });
            }

            await inter.followUp({content: await Translate(`載入您的搜尋... <🎧>`), ephemeral: true });

            queue.addTrack(res.tracks[query.content - 1]);

            if (!queue.isPlaying()) await queue.node.play();
        });

        collector.on('end', async (msg, reason) => {
            if (reason === 'time') return inter.followUp({ content: await Translate(`搜尋時間超時 <${inter.member}>... 再試一次？ <❌>`), ephemeral: true });
        });
    }
}
