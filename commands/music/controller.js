const { ApplicationCommandOptionType, ActionRowBuilder, ButtonBuilder, ChannelType, EmbedBuilder, PermissionsBitField } = require('discord.js');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'controller',
    description:("將音樂控制器傳送至頻道"),
    voiceChannel: false,
    permissions: PermissionsBitField.Flags.ManageMessages,
    options: [
        {
            name: 'channel',
            description:('您要傳送的文字頻道'),
            type: ApplicationCommandOptionType.Channel,
            required: true,
        }
    ],

    async execute({ inter }) {
        const channel = inter.options.getChannel('channel');
        if (channel.type !== ChannelType.GuildText) return inter.editReply({ content: await Translate(`您需要將其傳送至文字頻道... <❌>`) });

        const embed = new EmbedBuilder()
            .setTitle(await Translate('使用下面的按鈕控制您的音樂 ！'))
            .setImage(inter.guild.iconURL({ size: 4096, dynamic: true }))
            .setColor('#2f3136')
            .setFooter({ text: await Translate('音樂至上 - 社群用心製作 <❤️>'), iconURL: inter.member.avatarURL({ dynamic: true }) });

        inter.editReply({ content: await Translate(`傳送控制器至 <${channel}>... <✅>`) });

        let EmojiState = client.config.app.enableEmojis;

        const emojis = client.config.emojis;

        emojis ? EmojiState = EmojiState : EmojiState = false;

        const back = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.back : ('Back'))
            .setCustomId('back')
            .setStyle('Primary');

        const skip = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.skip : ('Skip'))
            .setCustomId('skip')
            .setStyle('Primary');

        const resumepause = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.ResumePause : ('Resume & Pause'))
            .setCustomId('resume&pause')
            .setStyle('Success');

        const save = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.savetrack : ('Save'))
            .setCustomId('savetrack')
            .setStyle('Success');

        const volumeup = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.volumeUp : ('Volume Up'))
            .setCustomId('volumeup')
            .setStyle('Primary');

        const volumedown = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.volumeDown : ('Volume Down'))
            .setCustomId('volumedown')
            .setStyle('Primary');

        const loop = new ButtonBuilder()
            .setLabel(EmojiState ? emojis.loop : ('Loop'))
            .setCustomId('loop')
            .setStyle('Danger');

        const np = new ButtonBuilder()
            .setLabel('Now Playing')
            .setCustomId('nowplaying')
            .setStyle('Secondary');

        const queuebutton = new ButtonBuilder()
            .setLabel('Queue')
            .setCustomId('queue')
            .setStyle('Secondary');

        const lyrics = new ButtonBuilder()
            .setLabel('lyrics')
            .setCustomId('Lyrics')
            .setStyle('Primary');

        const shuffle = new ButtonBuilder()
            .setLabel('Shuffle')
            .setCustomId('shuffle')
            .setStyle('Success');

        const stop = new ButtonBuilder()
            .setLabel('Stop')
            .setCustomId('stop')
            .setStyle('Danger');

        const row1 = new ActionRowBuilder().addComponents(back, resumepause, skip, stop, save);
        const row2 = new ActionRowBuilder().addComponents(volumedown, volumeup, loop);
        const row3 = new ActionRowBuilder().addComponents(lyrics, shuffle, queuebutton, np);

        channel.send({ embeds: [embed], components: [row1, row2, row3] });
    }
}
