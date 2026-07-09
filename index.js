const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const express = require('express');

const TOKEN = process.env.DISCORD_TOKEN_2;
const CHANNEL_ID = process.env.VOICE_CHANNEL_ID_2;

if (!TOKEN || !CHANNEL_ID) {
  console.error('[LỖI] Thiếu biến môi trường: DISCORD_TOKEN_2, VOICE_CHANNEL_ID_2');
  process.exit(1);
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.once('ready', async () => {
  console.log(`[OK] Bot ${client.user.tag} đã lên đèn thành công!`);

  try {
    const channel = await client.channels.fetch(CHANNEL_ID);
    if (channel && channel.isVoiceBased()) {
      joinVoiceChannel({
        channelId: channel.id,
        guildId: channel.guild.id,
        adapterCreator: channel.guild.voiceAdapterCreator,
      });
      console.log(`[OK] Đã nhảy vào phòng thoại: ${channel.name}`);
    }
  } catch (error) {
    console.error('[LỖI] Kênh thoại bị lỗi:', error);
  }
});

const app = express();
const PORT = process.env.PORT_2 || 3001;
app.get('/', (req, res) => res.send('Bot 2 online 24/7'));
app.listen(PORT, () => console.log(`[OK] Keepalive server on port ${PORT}`));

client.login(TOKEN);
