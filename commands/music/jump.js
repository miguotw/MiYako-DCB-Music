const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'jump',
    description:("跳到佇列中的特定音樂"),
    voiceChannel: true,
    options: [
        {
            name: 'song',
            description:('您要跳到的 曲目名稱/連結'),
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
        const number = inter.options.getNumber('number');
        if (!track && !number) inter.editReply({ content: await Translate(`您必須使用其中一個選項才能跳到一首音樂 <${inter.member}>... 再試一次？ <❌>`) });

        let trackName;
        if (track) {
            const toJump = queue.tracks.toArray().find((t) => t.title.toLowerCase() === track.toLowerCase() || t.url === track);
            if (!toJump) return inter.editReply({ content: await Translate(`找不到 <${track}> <${inter.member}>... 嘗試使用音樂的網址或全名？ <❌>`) });

            queue.node.jump(toJump);
            trackName = toJump.title;
        } else if (number) {
            const index = number - 1;
            const name = queue.tracks.toArray()[index].title;
            if (!name) return inter.editReply({ content: await Translate(`此音樂似乎不存在 <${inter.member}>...  再試一次？ <❌>`) });

            queue.node.jump(index);
            trackName = name;
        }

        const jumpEmbed = new EmbedBuilder()
            .setAuthor({ name: await Translate(`跳至 <${trackName}> <✅>`) })
            .setColor('#2f3136');

        inter.editReply({ embeds: [jumpEmbed] });
    }
}
