import linebot from 'linebot';
const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
});

const MESSAGE = {
  GET_URL: '取得活動網址',
};

const handleBotReplyError = (e) => {
  console.error(`reply message error`, JSON.stringify(e));
};

const getUrlController = async (event) => {
  try {
    await event.reply('this is your url');
  } catch (e) {
    handleBotReplyError(e);
  }
  return;
};

const messageController = (event) => {
  const text = event.message.text;
  console.log(JSON.stringify(event));
  switch (text) {
    case MESSAGE.GET_URL:
      return getUrlController(event);
    default:
      break;
  }
};

bot.on('message', messageController);

export default bot.parser();
