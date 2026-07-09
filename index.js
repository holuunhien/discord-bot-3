const { Client, GatewayIntentBits } = require('discord.js');
const { joinVoiceChannel } = require('@discordjs/voice');
const express = require('express');

const TOKEN = process.env.DISCORD_TOKEN_3;
const CHANNEL_ID = process.env.VOICE_CHANNEL_ID_3;

if (!TOKEN) {
  console.error('[LỖI] Thiếu biến môi trường: DISCORD_TOKEN_3');
  process.exit(1);
}

if (!CHANNEL_ID) {
  console.error('[LỖI] Thiếu biến môi trường: VOICE_CHANNEL_ID_3');
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
    } else {
      console.error('[LỖI] Channel ID không phải kênh thoại hoặc không tìm thấy.');
    }
  } catch (error) {
    console.error('[LỖI] Kênh thoại bị lỗi:', error.message);
  }
});

client.on('error', (error) => {
  console.error('[LỖI] Discord client error:', error.message);
});

process.on('unhandledRejection', (error) => {
  console.error('[LỖI] Unhandled rejection:', error);
});

const app = express();
const PORT = process.env.PORT || 3002;
app.get('/', (req, res) => res.send('Bot 3 online 24/7'));
app.listen(PORT, '0.0.0.0', () => console.log(`[OK] Keepalive server on port ${PORT}`));

client.login(TOKEN).catch((error) => {
  console.error('[LỖI] Đăng nhập thất bại:', error.message);
  process.exit(1);
});
