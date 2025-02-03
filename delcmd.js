require('dotenv').config();
const { Client, GatewayIntentBits, REST, Routes } = require('discord.js');

const client = new Client({
    intents: [GatewayIntentBits.Guilds]
});

client.once('ready', async () => {
    console.log(`✅ 已登入: ${client.user.tag}`);

    try {
        const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN);
        const applicationId = client.user.id;  // 確保機器人 ID 正確
        
        console.log(`📌 機器人 ID: ${applicationId}`);

        // 刪除全域斜線指令
        await rest.put(Routes.applicationCommands(applicationId), { body: [] });
        console.log("🚮 已清除全域斜線指令");

        // 取得所有伺服器
        const guilds = await client.guilds.fetch();

        // 刪除每個伺服器的專用斜線指令
        for (const [guildId] of guilds) {
            await rest.put(Routes.applicationGuildCommands(applicationId, guildId), { body: [] });
            console.log(`🗑️ 已清除伺服器 ${guildId} 的斜線指令`);
        }
    } catch (error) {
        console.error("❌ 刪除指令時發生錯誤:", error);
    }
});

client.login(process.env.DISCORD_TOKEN);