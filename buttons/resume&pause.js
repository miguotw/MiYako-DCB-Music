const { Translate } = require('../process_tools');

module.exports = async ({ inter, queue }) => {
    if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`目前沒有音樂正在播放... 再試一次？ <❌>`) });

    const resumed = queue.node.resume();
    let message = await Translate(`目前的音樂 <${queue.currentTrack.title}> 已恢復 <✅>`);

    if (!resumed) {
        queue.node.pause();
        message = await Translate(`目前的音樂 <${queue.currentTrack.title}> 已暫停 <✅>`);
    }

    return inter.editReply({ content: message });
}