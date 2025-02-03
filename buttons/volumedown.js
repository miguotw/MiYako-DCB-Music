const { Translate } = require('../process_tools');

const maxVol = client.config.opt.maxVol;

module.exports = async ({ inter, queue }) => {
    if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`目前沒有音樂正在播放... 再試一次？ <❌>`) });

    const vol = Math.floor(queue.node.volume - 5);
    if (vol < 0) return inter.editReply({ content: await Translate(`我無法再降低音量 <${inter.member}>... 再試一次？ <❌>`) });
    if (queue.node.volume === vol) return inter.editReply({ content: await Translate(`您要變更的音量已是目前的音量 <${inter.member}>... 再試一次？ <❌>`) });

    const success = queue.node.setVolume(vol);
    return inter.editReply({ content: success ? await Translate(`音量已修改為 <${vol}/${maxVol}% 🔊>`) : await Translate(`有些事情出錯了 <${inter.member}>... 再試一次？ <❌>`) });
}