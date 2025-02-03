const { EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'clear',
    description:('清除佇列中的所有音樂'),
    voiceChannel: true,

    async execute({ inter }) {
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`目前沒有音樂正在播放 <${inter.member}>... 再試一次？ <❌>`) });

        if (!queue.tracks.toArray()[1]) return inter.editReply({ content: await Translate(`在目前的音樂 <${inter.member}>之後，佇列中沒有音樂... 再試一次？  <❌>`) });

        queue.tracks.clear();

        const clearEmbed = new EmbedBuilder()
            .setAuthor({ name: await Translate(`佇列剛被清除 <🗑️>`) })
            .setColor('#2f3136');

        inter.editReply({ embeds: [clearEmbed] });
    }
}