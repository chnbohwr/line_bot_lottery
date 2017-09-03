import linebot from 'linebot';
import config from '../config/config';
import { Share, Ticket } from './db';

export const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
});

const MESSAGE = {
  GET_URL: '取得活動網址',
  ASK_TICKET: '詢問抽獎次數',
  GET_TICKET: '取得抽獎券',
};

const handleBotReplyError = (e) => {
  console.error(`reply message error`, JSON.stringify(e));
};

const askTicketController = async (event) => {
  const shareUserId = event.source.userId;
  const shareCount = await Share.count({ shareUserId, used: null});
  const ticketCount = Math.round(shareCount / config.shareChangeTicketCount);
  const usedTicketCount = await Ticket.count({shareUserId});
  event.reply(`還剩下${ticketCount}次抽獎機會， 已經使用${usedTicketCount}次抽獎， 觀看連結人數: ${shareCount}`);
};

const getUrlController = async (event) => {
  try {
    const shareUserId = event.source.userId;
    const redirectUrl = config.redirectUrl;
    const url = `${config.loginUrl}?response_type=code&client_id=${process.env.LOGIN_CHANNEL_ID}&redirect_uri=${redirectUrl}&state=${shareUserId}`;
    await event.reply(url);
  } catch (e) {
    handleBotReplyError(e);
  }
  return;
};

const messageController = (event) => {
  const text = event.message.text;
  switch (text) {
    case MESSAGE.GET_URL:
      return getUrlController(event);
    case MESSAGE.ASK_TICKET:
      return askTicketController(event);
    default:
      break;
  }
};

bot.on('message', messageController);

export default bot;

// {"type":"message","replyToken":"5fa1119da3a04f2dbfc5b610e3c4","source":{"userId":"U4510401b3d2b99c117dca0e306d","type":"user"},"timestamp":1504331479027,"message":{"type":"text","id":"6635924625955","text":"取得活動網址"}}
