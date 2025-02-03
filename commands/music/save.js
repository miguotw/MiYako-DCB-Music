const { EmbedBuilder } = require("discord.js");
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'save',
    description:('儲存目前的音樂'),
    voiceChannel: true,

    async execute({ inter }) {
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`目前沒有音樂正在播放 <${inter.member}>... 再試一次？ <❌>`) });

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
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
            return inter.editReply({ content: await Translate(`我已將音樂以私人訊息傳送給您 <✅>`) });
        }).catch(async () => {
            return inter.editReply({ content: await Translate(`無法傳送私人訊息給您... 再試一次？ <❌>`) });
        });
    }
}