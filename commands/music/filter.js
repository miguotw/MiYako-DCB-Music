const { ApplicationCommandOptionType, EmbedBuilder } = require('discord.js');
const { AudioFilters, useQueue } = require('discord-player');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'filter',
    description:('為您的音樂加入篩選器'),
    voiceChannel: true,
    options: [
        {
            name: 'filter',
            description:('您要新增的篩選條件'),
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [...Object.keys(AudioFilters.filters).map(m => Object({ name: m, value: m })).splice(0, 25)],
        }
    ],

    async execute({ inter }) {
        const queue = useQueue(inter.guild);
        if (!queue?.isPlaying()) return inter.editReply({ content: await Translate(`目前沒有音樂正在播放 <${inter.member}>... 再試一次？ <❌>`) });

        const actualFilter = queue.filters.ffmpeg.getFiltersEnabled()[0];
        const selectedFilter = inter.options.getString('filter');

        const filters = [];
        queue.filters.ffmpeg.getFiltersDisabled().forEach(f => filters.push(f));
        queue.filters.ffmpeg.getFiltersEnabled().forEach(f => filters.push(f));

        const filter = filters.find((x) => x.toLowerCase() === selectedFilter.toLowerCase().toString());

        let msg = await Translate (`此篩選器不存在 <${inter.member}>... 再試一次？ <❌ \n>`) +
            (actualFilter ? await Translate(`目前使用中的篩選器： <**${actualFilter}**. \n>`) : "") +
            await Translate(`可用篩選器清單： `);
        filters.forEach(f => msg += `- **${f}**`);

        if (!filter) return inter.editReply({ content: msg });

        await queue.filters.ffmpeg.toggle(filter);

        const filterEmbed = new EmbedBuilder()
            .setAuthor({ name: await Translate(`篩選器 <${filter}> 現在是 <${queue.filters.ffmpeg.isEnabled(filter) ? 'enabled' : 'disabled'}> <✅\n> *提醒：音樂越長，所需時間越長*`) })
            .setColor('#2f3136');

        return inter.editReply({ embeds: [filterEmbed] });
    }
}