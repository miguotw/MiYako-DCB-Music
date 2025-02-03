const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'pause',
    description:('暫停播放'),
    voiceChannel: true,

    async execute({ inter }) {
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`目前沒有音樂正在播放 <${inter.member}>... 再試一次？ <❌>`) });

        if (queue.node.isPaused()) return inter.editReply({ content: await Translate(`音樂已暫停， <${inter.member}>... 再試一次？ <❌>`) });

        const success = queue.node.setPaused(true);
        const pauseEmbed = new EmbedBuilder()
            .setAuthor({ name: success ? await Translate(`目前的音樂 <${queue.currentTrack.title}> 已暫停  <✅>`) : await Translate(`有些事情出錯了 <${inter.member}>... 再試一次？ <❌>`) })
            .setColor('#2f3136')

        return inter.editReply({ embeds: [pauseEmbed] });
    }
}