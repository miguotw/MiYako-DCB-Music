const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'shuffle',
    description:('洗牌播放佇列'),
    voiceChannel: true,

    async execute({ inter }) {
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`目前沒有音樂正在播放 <${inter.member}>... 再試一次？ <❌>`) });

        if (!queue.tracks.toArray()[0]) return inter.editReply({ content: await Translate(`在目前的音樂之後，佇列中沒有音樂 <${inter.member}>... 再試一次？ <❌>`) });

        queue.tracks.shuffle();

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setAuthor({ name: await Translate(`佇列已洗牌 <${queue.tracks.size}> 首歌曲！ <✅>`) });

        return inter.editReply({ embeds: [embed] });
    }
}