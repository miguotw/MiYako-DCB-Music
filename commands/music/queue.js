const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'queue',
    description:('取得佇列中的音樂'),
    voiceChannel: true,

    async execute({ client, inter }) {
        const queue = useQueue(inter.guild);

        if (!queue) return inter.editReply({ content: await Translate(`目前沒有音樂正在播放 <${inter.member}>... 再試一次？ <❌>`) });
        if (!queue.tracks.toArray()[0]) return inter.editReply({ content: await Translate(`在目前的音樂之後，佇列中沒有音樂 <${inter.member}>... 再試一次？ <❌>`) });

        const methods = ['', '🔁', '🔂'];
        const songs = queue.tracks.size;
        const nextSongs = songs > 5 ? await Translate(`以及 <**${songs - 5}**> 首音樂...`) : await Translate(`在播放清單有 <**${songs}**> 首音樂...`);
        const tracks = queue.tracks.map((track, i) => `**${i + 1}** - ${track.title} | ${track.author} (請求： ${track.requestedBy ? track.requestedBy.displayName : "unknown"})`);
        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setThumbnail(inter.guild.iconURL({ size: 2048, dynamic: true }))
            .setAuthor({ name: await Translate(`伺服器佇列 - <${inter.guild.name}> <${methods[queue.repeatMode]}>`), iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) })
            .setDescription(await Translate(`目前的 <${queue.currentTrack.title}> <\n\n> <${tracks.slice(0, 5).join('\n')}> <\n\n> <${nextSongs}>`))
            .setTimestamp()
            .setFooter({ text: await Translate('音樂至上 - 社群用心製作 <❤️>'), iconURL: inter.member.avatarURL({ dynamic: true }) });

        inter.editReply({ embeds: [embed], ephemeral: false });
    }
}