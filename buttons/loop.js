const { QueueRepeatMode } = require('discord-player');
const { Translate } = require('../process_tools');

module.exports = async ({ inter, queue }) => {
    const methods = ['disabled', 'track', 'queue'];
    if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`目前沒有音樂正在播放... 再試一次？ <❌>`) });

    if (queue.repeatMode === 2) queue.setRepeatMode(QueueRepeatMode.OFF)
    else queue.setRepeatMode(queue.repeatMode + 1)

    return inter.editReply({ content: await Translate(`循環已設定為 <**${methods[queue.repeatMode]}**>.<✅>`) });
}