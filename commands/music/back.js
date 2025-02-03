const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'back',
    description:("回到上次播放的音樂"),
    voiceChannel: true,

    async execute({ inter }) {
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`目前沒有音樂正在播放 <${inter.member}>... 再試一次？ <❌>`) });

        if (!queue.history.previousTrack) return inter.editReply({ content: await Translate(`在 <${inter.member}>之前沒有播放音樂... 再試一次 ?  <❌>`) });

        await queue.history.back();

        const backEmbed = new EmbedBuilder()
            .setAuthor({ name: await Translate(`播放上一首音樂 <✅>`) })
            .setColor('#2f3136');

        inter.editReply({ embeds: [backEmbed] });
    }
}