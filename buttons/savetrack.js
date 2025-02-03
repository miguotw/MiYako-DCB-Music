const { EmbedBuilder } = require('discord.js');
const { Translate } = require('../process_tools');

module.exports = async ({ inter, queue }) => {
    if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`目前沒有音樂正在播放... 再試一次？ <❌>`) });

    const embed = new EmbedBuilder()
        .setColor('Red')
        .setTitle(`:arrow_forward: ${queue.currentTrack.title}`)
        .setURL(queue.currentTrack.url)
        .addFields(
            { name: await Translate('Duration <:hourglass:>'), value: `\`${queue.currentTrack.duration}\``, inline: true },
            { name: await Translate('Song by:'), value: `\`${queue.currentTrack.author}\``, inline: true },
            { name: await Translate('Views <:eyes:>'), value: `\`${Number(queue.currentTrack.views).toLocaleString()}\``, inline: true },
            { name: await Translate('Song <URL>:'), value: `\`${queue.currentTrack.url}\`` }
        )
        .setThumbnail(queue.currentTrack.thumbnail)
        .setFooter({ text: await Translate(`來自伺服器 <${inter.member.guild.name}>`), iconURL: inter.member.guild.iconURL({ dynamic: false }) });

    inter.member.send({ embeds: [embed] })
        .then(async () => {
            return inter.editReply({ content: await Translate(`我已透過私人訊息將音樂標題傳送給您 <✅>`) });
        }).catch(async (error) => {
            console.error(error);
            return inter.editReply({ content: await Translate(`無法傳送私人訊息給您... 再試一次？ <❌>`) });
        });
}
