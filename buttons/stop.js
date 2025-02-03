const { EmbedBuilder } = require('discord.js');
const { Translate } = require('../process_tools');

module.exports = async ({ inter, queue }) => {
    if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`目前沒有音樂正在播放... 再試一次？ <❌>`) });

    queue.delete();

    const embed = new EmbedBuilder()
        .setColor('#2f3136')
        .setAuthor({ name: await Translate(`音樂停止進入這個伺服器，下次見 <✅>`) });

    return inter.editReply({ embeds: [embed] });
}