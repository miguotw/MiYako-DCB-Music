const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'resume',
    description:('恢復播放'),
    voiceChannel: true,

    async execute({ inter }) {
        const queue = useQueue(inter.guild);
        if (!queue) return inter.editReply({ content: await Translate(`目前沒有音樂正在播放 <${inter.member}>... 再試一次？ <❌>`) });

        if (queue.node.isPlaying()) return inter.editReply({ content: await Translate(`音樂已經開始播放， <${inter.member}>... 再試一次？ <❌>`) })

        const success = queue.node.resume();

        const resumeEmbed = new EmbedBuilder()
            .setAuthor({ name: success ? await Translate(`目前的音樂 <${queue.currentTrack.title}> 已恢復播放 <✅>`) : await Translate(`有些事情出錯了 <${inter.member}>... 再試一次？ <❌>`) })
            .setColor('#2f3136')

        return inter.editReply({ embeds: [resumeEmbed] });
    }
}
