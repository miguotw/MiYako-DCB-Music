const { EmbedBuilder } = require('discord.js');
const { Translate } = require('../../process_tools');

module.exports = (queue, track) => {
    if (!client.config.app.extraMessages) return;

    (async () => {
        const embed = new EmbedBuilder()
        .setAuthor({ name: await Translate(`在佇列中加入音樂 <${track.title}> <✅>`), iconURL: track.thumbnail })
        .setColor('#2f3136');

        queue.metadata.channel.send({ embeds: [embed] });
    })()
}