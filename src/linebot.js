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
    const shareUserId = event.source.userId;
    const redirectUrl = `https://d4dd54ac.ngrok.io/lotteryEvent?shareUser=${shareUserId}`;
    const url = `https://access.line.me/dialog/oauth/weblogin?response_type=code&client_id=${process.env.LOGIN_CHANNEL_ID}&redirect_uri=${redirectUrl}&state=${shareUserId}`;
    await event.reply(url);
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

// {"type":"message","replyToken":"5fa1119da3a04f2dbfc5b610e3c4","source":{"userId":"U4510401b3d2b99c117dca0e306d","type":"user"},"timestamp":1504331479027,"message":{"type":"text","id":"6635924625955","text":"取得活動網址"}}
