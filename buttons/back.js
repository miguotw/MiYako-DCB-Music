const { Translate } = require('../process_tools');

module.exports = async ({ inter, queue }) => {
  if (!queue?.isPlaying())
    return inter.editReply({
      content: await Translate(`目前沒有音樂正在播放... 再試一次？ <❌>`),
    });
  if (!queue.history.previousTrack)
    return inter.editReply({
      content: await Translate(`在 <${inter.member}> 之前沒有播放任何音樂... 再試一次？ <❌>`),
    });

  await queue.history.back();

  inter.editReply({
    content: await Translate(`播放 <**previous**> 音樂 <✅>`),
  });
};
