const ms = require('ms');
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'seek',
    description: '在歌曲中 回溯/前進',
    voiceChannel: true,
    options: [
        {
            name: 'time',
            description:('跳轉到的時間'),
            type: ApplicationCommandOptionType.String,
            required: true,
        }
    ],
    
    async execute({ inter }) {
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`目前沒有音樂正在播放 <${inter.editReply}>... 再試一次？ <❌>`) });

        const timeToMS = ms(inter.options.getString('time'));
        if (timeToMS >= queue.currentTrack.durationMS) {
            return inter.editReply({ content: await Translate(`指定的時間高於目前音樂的總時間 <${inter.member}>... 再試一次？ <❌\n> *嘗試有效的時間，例如 <**5s, 10s, 20 seconds, 1m**>...*`) });
        }

        await queue.node.seek(timeToMS);

        const embed = new EmbedBuilder()
            .setColor('#2f3136')
            .setAuthor({ name: await Translate(`在目前歌曲上設定的時間 <**${ms(timeToMS, { long: true })}**> <✅>`) });

        inter.editReply({ embeds: [embed] });
    }
}