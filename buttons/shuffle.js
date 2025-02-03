const { EmbedBuilder } = require('discord.js');
const { Translate } = require('../process_tools');

module.exports = async ({ inter, queue }) => {
    if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`目前沒有音樂正在播放... 再試一次？ <❌>`) });
    if (!queue.tracks.toArray()[0]) return inter.editReply({ content: await Translate(`在目前的音樂之後，佇列中沒有音樂 <${inter.member}>... 再試一次？ <❌>`) });

    await queue.tracks.shuffle();

    const embed = new EmbedBuilder()
        .setColor('#2f3136')
        .setAuthor({ name: await Translate(`佇列已洗牌 <${queue.tracks.size}> 首音樂！ <✅>`) });

    return inter.editReply({ embeds: [embed] });
}