const { EmbedBuilder } = require('discord.js');
const { useMainPlayer } = require('discord-player');
const { Translate } = require('../process_tools');

module.exports = async ({ inter, queue }) => {
    const player = useMainPlayer();
    if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`目前沒有音樂正在播放 <${inter.member}>... 再試一次？ <❌>`) });

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

    const trimmedLyrics = lyrics.plainLyrics.substring(0, 1997);

    const embed = new EmbedBuilder()
        .setTitle(`Lyrics for ${queue.currentTrack.title}`)
        .setAuthor({
            name: lyrics.artistName
        })
        .setDescription(trimmedLyrics.length === 1997 ? `${trimmedLyrics}...` : trimmedLyrics)
        .setFooter({ text: await Translate('音樂至上 - 社群用心製作 <❤️>'), iconURL: inter.member.avatarURL({ dynamic: true }) })
        .setTimestamp()
        .setColor('#2f3136');

    return inter.editReply({ embeds: [embed] });
}