import linebot from 'linebot';
import config from '../config/config';
import shortid from 'shortid';
import { Share, Ticket } from './db';
import shortUrl from './shortUrl';

export const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
});

const MESSAGE = {
  GET_URL: '取得活動網址',
  ASK_TICKET: '詢問抽獎次數',
  GET_TICKET: '抽獎',
  EVENT_INFO: '活動說明',
};

const handleBotReplyError = (error, event) => {
  console.error(JSON.stringify(error), JSON.stringify(event));
  reply(`出錯了糟糕，請截圖聯絡管理員 errorcode:${event.timestamp}+${event.source.userId}`);
};

const askTicketController = async (event) => {
  try {
    const userId = event.source.userId;
    const notShareCount = await Share.count({ shareUserId, used: null });
    const shareCount = await Share.count({ shareUserId });
    const usedTicketCount = await Ticket.count({ userId });
    const ticketCount = Math.round(notShareCount / config.shareChangeTicketCount);
    event.reply(`還剩下${ticketCount}次抽獎機會， 已經使用${usedTicketCount}次抽獎， 觀看連結人數: ${shareCount}`);
  } catch (e) {
    throw e;
  }
  return;
};

const getTicketController = async (event) => {
  try {
    const shareUserId = event.source.userId;
    const shareCount = await Share.count({ shareUserId, used: null });
    const userProfile = await event.source.profile();
    const ticketCount = Math.round(shareCount / config.shareChangeTicketCount);
    if (ticketCount > 0) {
      const ticket = {
        ...userProfile,
        ticketId: shortid.generate(),
        createAt: new Date(),
        bingo: (Math.random() * 100) < config.ticketProbability,
      };
      const shares = await Share.find({ shareUserId, used: null }, { limit: config.shareChangeTicketCount });
      shares.forEach((share) => Share.findOneAndUpdate({ _id: share._id }, { $set: { used: true } }));
      const dbTicket = await Ticket.insert(ticket);
      if (dbTicket.bingo) {
        event.reply(`[恭喜中獎]序號是: ${dbTicket.ticketId}`);
      } else {
        event.reply(`沒有中獎，請再接再勵`);
      }
    } else {
      event.reply(`抽獎券不足，輸入：${MESSAGE.ASK_TICKET} 察看擁有的抽獎券`);
    }
  } catch (e) {
    throw e;
  }
  return;
};

const getUrlController = async (event) => {
  try {
    const shareUserId = event.source.userId;
    const redirectUrl = config.redirectUrl;
    const url = `${config.loginUrl}?response_type=code&client_id=${process.env.LOGIN_CHANNEL_ID}&redirect_uri=${redirectUrl}&state=${shareUserId}`;
    const newUrl = await shortUrl(url);
    await event.reply(newUrl);
  } catch (e) {
    throw e;
  }
  return;
};

const eventInfoController = (event) => {
  try {
    event.reply(`這是活動說明 複製活動連結給朋友，每${config.shareChangeTicketCount}人看過就可以進行一次抽獎`);
  } catch (e) {
    throw e;
  }
  return;
};

const messageController = (event) => {
  const text = event.message.text;
  try {
    switch (text) {
      case MESSAGE.GET_URL:
        return getUrlController(event);
      case MESSAGE.ASK_TICKET:
        return askTicketController(event);
      case MESSAGE.GET_TICKET:
        return getTicketController(event);
      case MESSAGE.EVENT_INFO:
      default:
        return eventInfoController(event);
    }
  } catch (e) {
    handleBotReplyError(e, evnet);
  }
};

bot.on('message', messageController);

export default bot;

// {"type":"message","replyToken":"5fa1119da3a04f2dbfc5b610e3c4","source":{"userId":"U4510401b3d2b99c117dca0e306d","type":"user"},"timestamp":1504331479027,"message":{"type":"text","id":"6635924625955","text":"取得活動網址"}}
