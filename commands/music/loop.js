const { QueueRepeatMode, useQueue } = require('discord-player');
const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'loop',
    description:('切換循環播放 佇列/音樂'),
    voiceChannel: true,
    options: [
        {
            name: 'action',
            description:('您要在循環上執行的動作'),
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                { name: 'Queue', value: 'enable_loop_queue' },
                { name: 'Disable', value: 'disable_loop' },
                { name: 'Song', value: 'enable_loop_song' },
                { name: 'Autoplay', value: 'enable_autoplay' },
            ],
        }
    ],

   async execute({ inter }) {
        const queue = useQueue(inter.guild);
        const errorMessage = await Translate(`有些事情出錯了 <${inter.member}>... 再試一次？ <❌>`);
        let baseEmbed = new EmbedBuilder()
            .setColor('#2f3136');

        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`目前沒有音樂正在播放 <${inter.member}>... 再試一次？ <❌>`) });

        switch (inter.options._hoistedOptions.map(x => x.value).toString()) {
            case 'enable_loop_queue': {
                if (queue.repeatMode === QueueRepeatMode.TRACK) return inter.editReply({ content: `您必須先在循環模式下停用目前的音樂 (\`/loop Disable\`) ${inter.member}... 再試一次？ ❌` });

                const success = queue.setRepeatMode(QueueRepeatMode.QUEUE);
                baseEmbed.setAuthor({ name: success ? errorMessage : await Translate(`啟用重複模式，整個佇列會無止境地重複 <🔁>`) })

                return inter.editReply({ embeds: [baseEmbed] });
            }
            case 'disable_loop': {
                if (queue.repeatMode === QueueRepeatMode.OFF) return inter.editReply({ content: await Translate(`您必須先啟用重複模式 <(/loop Queue 或 /loop Song)> <${inter.member}>... 再試一次？ <❌>`) });

                const success = queue.setRepeatMode(QueueRepeatMode.OFF);
                baseEmbed.setAuthor({ name: success ? errorMessage : await Translate(`重複模式已停用，佇列將不再重複 <🔁>`) })

                return inter.editReply({ embeds: [baseEmbed] });
            }
            case 'enable_loop_song': {
                if (queue.repeatMode === QueueRepeatMode.QUEUE) return inter.editReply({ content: await Translate(`您必須先在重複模式下停用目前的音樂 <(\`/loop Disable\`)> <${inter.member}>... 再試一次？ <❌>`) });

                const success = queue.setRepeatMode(QueueRepeatMode.TRACK);
                baseEmbed.setAuthor({ name: success ? errorMessage : await Translate(`啟用重複模式後，目前的歌曲會無止境地重複播放 <\`/loop disable\` >)`) })

                return inter.editReply({ embeds: [baseEmbed] });
            }
            case 'enable_autoplay': {
                if (queue.repeatMode === QueueRepeatMode.AUTOPLAY) return inter.editReply({ content: await Translate(`您必須先在循環模式中停用目前的音樂 <(\`/loop Disable\`)> <${inter.member}>... 再試一次？ <❌>`) });

                const success = queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
                baseEmbed.setAuthor({ name: success ? errorMessage : await Translate(`啟用自動播放功能後，佇列中會自動加入與目前歌曲相似的歌曲 <🔁>`) })

                return inter.editReply({ embeds: [baseEmbed] });
            }
        }
    }
}