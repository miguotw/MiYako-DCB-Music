const { EmbedBuilder } = require('discord.js');
const { Translate } = require('../process_tools');

module.exports = async ({ client, inter, queue }) => {
    if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`目前沒有音樂正在播放... 再試一次？ <❌>`) });
    if (!queue.tracks.toArray()[0]) return inter.editReply({ content: await Translate(`No music in the queue after the current one <${inter.member}>... 再試一次？ <❌>`) });

    const methods = ['', '🔁', '🔂'];
    const songs = queue.tracks.length;
    const nextSongs = songs > 5 ? await Translate(`以及 <**${songs - 5}**> 首音樂...`) : await Translate(`在播放清單 <**${songs}**> 中的音樂...`);
    const tracks = queue.tracks.map(async (track, i) => await Translate(`<**${i + 1}**> - <${track.title} | ${track.author}> (請求： <${track.requestedBy ? track.requestedBy.displayName : "unknown"}>)`));

    const embed = new EmbedBuilder()
        .setColor('#ff0000')
        .setThumbnail(inter.guild.iconURL({ size: 2048, dynamic: true }))
        .setAuthor({ name: await Translate(`伺服器佇列 - <${inter.guild.name} ${methods[queue.repeatMode]}>`), iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) })
        .setDescription(`Current ${queue.currentTrack.title}\n\n${tracks.slice(0, 5).join('\n')}\n\n${nextSongs}`)
        .setTimestamp()
        .setFooter({ text: await Translate('音樂至上 - 社群用心製作 <❤️>'), iconURL: inter.member.avatarURL({ dynamic: true }) });

    inter.editReply({ embeds: [embed] });
}
