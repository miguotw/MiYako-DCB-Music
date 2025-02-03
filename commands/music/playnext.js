const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { QueryType, useMainPlayer, useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'playnext',
    description:("插播到下一首音樂"),
    voiceChannel: true,
    options: [
        {
            name: 'song',
            description:('您想播放的音樂'),
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],

    async execute({ inter }) {
        const player = useMainPlayer();
        const queue = useQueue(inter.guild);

        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`目前沒有音樂正在播放 <${inter.member}>... 再試一次？ <❌>`) });

        const song = inter.options.getString('song');
        const res = await player.search(song, {
            requestedBy: inter.member,
            searchEngine: QueryType.AUTO
        });

        if (!res?.tracks.length) return inter.editReply({ content: await Translate(`沒有找到結果 <${inter.member}>... 再試一次？ <❌>`) });

        if (res.playlist) return inter.editReply({ content: await Translate(`此指令不支援播放清單的 <${inter.member}>... 再試一次？ <❌>`) });

        queue.insertTrack(res.tracks[0], 0);

        const playNextEmbed = new EmbedBuilder()
            .setAuthor({ name: await Translate(`音軌已插入佇列... 接下來將播放 <🎧>`) })
            .setColor('#2f3136');

        await inter.editReply({ embeds: [playNextEmbed], ephemeral: false });
    }
}
