const { EmbedBuilder } = require('discord.js');
const { Translate } = require('../process_tools');

module.exports = async ({ client, inter, queue }) => {
    if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`目前沒有音樂正在播放... 再試一次？ <❌>`) });

    const track = queue.currentTrack;
    const methods = ['disabled', 'track', 'queue'];
    const timestamp = track.duration;
    const trackDuration = timestamp.progress == 'Infinity' ? 'infinity (live)' : track.duration;
    const progress = queue.node.createProgressBar();

    const embed = new EmbedBuilder()
        .setAuthor({ name: track.title, iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) })
        .setThumbnail(track.thumbnail)
        .setDescription(await Translate(`Volume <**${queue.node.volume}**%\n> <Duration **${trackDuration}**\n> <Progress ${progress}\n> <Loop mode **${methods[queue.repeatMode]}**\n> <Requested by ${track.requestedBy}>`))
        .setFooter({ text: '音樂至上 - 社群用心製作 ❤️', iconURL: inter.member.avatarURL({ dynamic: true }) })
        .setColor('ff0000')
        .setTimestamp();

    inter.editReply({ embeds: [embed] });
}
