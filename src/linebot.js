import linebot from 'linebot';
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
});

const getMessage = async (event) => {
  try {
    await event.reply(event.message.text);
  } catch (e) {
    console.error(`reply message error`, JSON.stringify(e));
  }
};

bot.on('message', getMessage);

export default bot.parser();
