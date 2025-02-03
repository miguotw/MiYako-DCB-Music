const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'skip',
    description:('跳過音樂'),
    voiceChannel: true,

    async execute({ inter }) {
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`目前沒有音樂正在播放 <${inter.member}>... 再試一次？ <❌>`) });

        const success = queue.node.skip();

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setAuthor({ name: success ? await Translate(`當前音樂 <${queue.currentTrack.title}> 已跳過 <✅>`) : await Translate(`有些事情出錯了 <${inter.member}>... 再試一次？ <❌>`) });

        return inter.editReply({ embeds: [embed] });
    }
}