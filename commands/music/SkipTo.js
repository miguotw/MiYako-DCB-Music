const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'skipto',
    description:("跳轉到佇列中的特定音樂"),
    voiceChannel: true,
    options: [
        {
            name: 'song',
            description:('您想要跳轉到的音樂 名稱/連結'),
            type: ApplicationCommandOptionType.String,
            required: false,
        },
        {
            name: 'number',
            description:('音樂在佇列中的位置'),
            type: ApplicationCommandOptionType.Number,
            required: false,
        }
    ],

    async execute({ inter }) {
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`目前沒有音樂正在播放 <${inter.member}>... 再試一次？ <❌>`) });

        const track = inter.options.getString('song');
        const number = inter.options.getNumber('number')
        if (!track && !number) return inter.editReply({ content: await Translate(`您必須使用其中一個選項才能跳轉音樂 <${inter.member}>... 再試一次？ <❌>`) });

        let trackName;

        if (track) {
            const skipTo = queue.tracks.toArray().find((t) => t.title.toLowerCase() === track.toLowerCase() || t.url === track)
            if (!skipTo) return inter.editReply({ content: await Translate(`找不到 <${track}> <${inter.member}>... 試試使用歌曲的網址或全名？ <❌>`) });

            trackName = skipTo.title;

            queue.node.skipTo(skipTo);
        } else if (number) {
            const index = number - 1;
            const name = queue.tracks.toArray()[index].title;
            if (!name) return inter.editReply({ content: await Translate(`此音樂似乎不存在 <${inter.member}>... 再試一次？ <❌>`) });

            trackName = name;

            queue.node.skipTo(index);
        }

        const embed = new EmbedBuilder()
            .setAuthor({ name: await Translate(`跳轉到 <${trackName}> <✅>`) })
            .setColor('#2f3136')

        inter.editReply({ embeds: [embed] });
    }
}
