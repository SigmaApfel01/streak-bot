const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

// 🔥 MUSS NACH client erstellt sein
client.once("ready", () => {
  console.log(`Bot ist online als ${client.user.tag}`);
});

// Daten speichern
let data = {};
const DATA_FILE = "./data.json";

if (fs.existsSync(DATA_FILE)) {
  data = JSON.parse(fs.readFileSync(DATA_FILE));
}

function saveData() {
  fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));
}

client.on("messageCreate", async (message) => {
  if (message.author.bot) return;

  const userId = message.author.id;
  const today = new Date().toDateString();

  if (!data[userId]) {
    data[userId] = { streak: 1, lastDay: today };
  } else {
    if (data[userId].lastDay !== today) {
      data[userId].streak += 1;
      data[userId].lastDay = today;
    }
  }

  saveData();

  const streak = data[userId].streak;

  try {
    await message.member.setNickname(`🔥${streak} ${message.author.username}`);
  } catch (err) {
    console.log(err);
  }
});

client.login(process.env.DISCORD_TOKEN);