const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { useMainPlayer, useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'remove',
    description: "從佇列中移除音樂",
    voiceChannel: true,
    options: [
        {
            name: 'song',
            description:('您要移除的音樂 名稱/連結'),
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

        const number = inter.options.getNumber('number');
        const track = inter.options.getString('song');
        if (!track && !number) inter.editReply({ content: await Translate(`您必須使用其中一個選項來移除歌曲 <${inter.member}>... 再試一次？ <❌>`) });

        let trackName;

        if (track) {
            const toRemove = queue.tracks.toArray().find((t) => t.title === track || t.url === track);
            if (!toRemove) return inter.editReply({ content: await Translate(`找不到 <${track}> <${inter.member}>... 試試使用音樂的網址或全名？ <❌>`) });

            queue.removeTrack(toRemove);
        } else if (number) {
            const index = number - 1;
            const name = queue.tracks.toArray()[index].title;
            if (!name) return inter.editReply({ content: await Translate(`此音樂似乎不存在 <${inter.member}>...  再試一次？ <❌>`) });

            queue.removeTrack(index);

            trackName = name;
        }
        
        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setAuthor({ name: await Translate(`從佇列中移除 <${trackName}> <✅>`) });

        return inter.editReply({ embeds: [embed] });
    }
}
