const { Translate } = require('../../process_tools');

module.exports = async (client) => {
    console.log(await Translate(`登入客戶端 <${client.user.username}>.`));
    console.log(await Translate("來點音樂吧！"));
    
    client.user.setActivity(client.config.app.playing, { type: 5 });
}