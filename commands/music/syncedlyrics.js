const { useMainPlayer, useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'syncedlyrics',
    description:('與音樂同步歌詞'),
    voiceChannel: true,

    async execute({ inter }) {
        const player = useMainPlayer();
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`目前沒有音樂正在播放 <${inter.member}>... 再試一次？ <❌>`) });

        const metadataThread = queue.metadata.lyricsThread;
        if (metadataThread && !metadataThread.archived) return inter.editReply({ content: await Translate(`歌詞主題已建立 <${inter.member}> ! <${queue.metadata.lyricsThread}>`) });

        const results = await player.lyrics
            .search({
                q: queue.currentTrack.title
            })
            .catch(async (e) => {
                console.log(e);
                return inter.editReply({ content: await Translate(`錯誤！請聯絡開發人員！ | <❌>`) });
            });

        const lyrics = results?.[0];
        if (!lyrics?.plainLyrics) return inter.editReply({ content: await Translate(`沒有找到 <${queue.currentTrack.title}> 的歌詞... 再試一次？ <❌>`) });
        
        const thread = await queue.metadata.channel.threads.create({
            name: `${queue.currentTrack.title} 的歌詞`
        });

        queue.setMetadata({
            channel: queue.metadata.channel,
            lyricsThread: thread
        });

        const syncedLyrics = queue?.syncedLyrics(lyrics);
        syncedLyrics.onChange(async (lyrics) => {
            await thread.send({
                content: lyrics
            });
        });

        syncedLyrics?.subscribe();

        return inter.editReply({ content: await Translate(`成功同步 <${thread}>中的歌詞！ <${inter.member}> <✅>`) });
    }
}

