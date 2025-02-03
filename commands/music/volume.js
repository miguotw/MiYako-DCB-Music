const maxVol = client.config.opt.maxVol || 100;
const { ApplicationCommandOptionType } = require('discord.js');
const { useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'volume',
    description:('調整音量'),
    voiceChannel: true,
    options: [
        {
            name: 'volume',
            description:('新音量'),
            type: ApplicationCommandOptionType.Number,
            required: true,
            minValue: 1,
            maxValue: maxVol
        }
    ],

    async execute({ inter }) {
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`目前沒有音樂正在播放 <${inter.member}>... 再試一次？ <❌>`) });

        const vol = inter.options.getNumber('volume');
        if (queue.node.volume === vol) return inter.editReply({ content: await Translate(`新音量已是目前的音量 <${inter.member}>... 再試一次？ <❌>`) });

        const success = queue.node.setVolume(vol);

        return inter.editReply({ content: success ? await Translate(`音量已修改為 <${vol}/${maxVol}%> <🔊>`) : `有些事情出錯了 ${inter.member}... 再試一次？ ❌` });
    }
}