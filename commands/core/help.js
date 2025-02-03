const { EmbedBuilder } = require('discord.js');
const { Translate } = require('../../process_tools');

module.exports = {
    name: 'help',
    description:("這個機器人擁有的所有指令！"),
    showHelp: false,

    async execute({ client, inter }) {
        const commands = client.commands.filter(x => x.showHelp !== false);

        const embed = new EmbedBuilder()
            .setColor('#ff0000')
            .setAuthor({ name: client.user.username, iconURL: client.user.displayAvatarURL({ size: 1024, dynamic: true }) })
            .setDescription(await Translate('這個程式碼來自一個 <GitHub> 專案 <[ZerioDev/Music-bot](https://github.com/ZerioDev/Music-bot)>.<\n>使用這段代碼是可以免費的，但需要保留原作者的版權。<\n>如果你希望去除這些版權標註，可以加入他們的 Discord 支援伺服器，點擊 <[這裡](https://discord.gg/5cGSYV8ZZj)> 進入。)'))
            .addFields([{ name: `Enabled - ${commands.size}`, value: commands.map(x => `\`${x.name}\``).join(' | ') }])
            .setTimestamp()
            .setFooter({ text: await Translate('音樂至上 - 社群用心製作 <❤️>'), iconURL: inter.member.avatarURL({ dynamic: true }) });

        inter.editReply({ embeds: [embed] });
    }
};