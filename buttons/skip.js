const { Translate } = require("../process_tools");

module.exports = async ({ inter, queue }) => {
    if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`目前沒有音樂正在播放... 再試一次？ <❌>`) });

    const success = queue.node.skip();

    return inter.editReply({ content: success ? await Translate(`目前的音樂 <${queue.currentTrack.title}> 已跳過 <✅>`) : await Translate(`有些事情出錯了 <${inter.member}>... 再試一次？ <❌>`) });
}