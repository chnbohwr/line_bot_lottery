import linebot from 'linebot';
import config from './config/config';
import shortid from 'shortid';
import { Share, Ticket } from './db';
import shortUrl from './shortUrl';

// prevent attack
const nowLotteryUserId = {};

export const bot = linebot({
  channelId: process.env.CHANNEL_ID,
  channelSecret: process.env.CHANNEL_SECRET,
  channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN,
});

const MESSAGE = {
  EVENT_INFO: '活動說明',
  LOTTERY: '抽獎+抽獎查詢',
};

const looserMessage = `沒有中獎，請再接再勵`;

const handleBotReplyError = (error, event) => {
  console.error(JSON.stringify(error), JSON.stringify(event));
  reply(`出錯了糟糕，請截圖聯絡管理員 errorcode:${event.timestamp}+${event.source.userId}`);
};

const notickController = async (event) => {
  const totalBingo = await Ticket.count({ bingo: true });
  if (totalBingo >= config.totalTicket) {
    event.reply(looserMessage);
    throw new Error('全部的獎券都送光了');
  } else {
    return true;
  }
};

const sendTicketController = async (event) => {
  const shareUserId = event.source.userId;
  const userProfile = await event.source.profile();
  const ticket = {
    ...userProfile,
    ticketId: shortid.generate(),
    createAt: new Date(),
    bingo: (Math.random() * 100) < config.ticketProbability,
  };
  // mark shares to disable.
  const shares = await Share.find({ shareUserId, used: null }, { limit: config.shareChangeTicketCount });
  shares.forEach((share) => Share.findOneAndUpdate({ _id: share._id }, { $set: { used: true } }));
  const dbTicket = await Ticket.insert(ticket);
  if (dbTicket.bingo) {
    return (
      `[恭喜中獎]序號是: ${dbTicket.ticketId}
中獎後將序號發送到
LINE:meowdraw
這個帳號才能發送獎勵給你
一組序號可兌換秒抽上貼圖*1
兩組序號可兌換所有貼圖*1
      `);
  } else {
    return (`沒有中獎，請再接再勵`);
  }
};

const lotteryController = async (event) => {
  const shareUserId = event.source.userId;
  if (nowLotteryUserId[shareUserId]) {
    event.reply('忙線中....');
    return;
  }
  nowLotteryUserId[shareUserId] = true;
  try {
    const shareCount = await Share.count({ shareUserId, used: null });
    const totalShareCount = await Share.count({ shareUserId });
    const ticketCount = Math.floor(shareCount / config.shareChangeTicketCount);
    const replyMessages = [];
    await notickController(event);
    if (ticketCount) {
      const msg = await sendTicketController(event);
      replyMessages.push(msg);
    } else {
      replyMessages.push('你的抽獎券不足，快把連結分享給更多朋友吧');
    }
    const usedTicketCount = await Ticket.count({ userId: shareUserId });
    replyMessages.push(`還剩下${ticketCount > 0 ? ticketCount - 1 : 0}次抽獎機會， 已經使用${usedTicketCount}次抽獎， 觀看連結人數: ${totalShareCount}`);
    event.reply(replyMessages);
    delete nowLotteryUserId[shareUserId];
  } catch (e) {
    throw e;
    delete nowLotteryUserId[shareUserId];
  }
};

const eventInfoController = async (event) => {
  const shareUserId = event.source.userId;
  const redirectUrl = config.redirectUrl;
  const url = `${config.loginUrl}?response_type=code&client_id=${process.env.LOGIN_CHANNEL_ID}&redirect_uri=${redirectUrl}&state=${shareUserId}`;
  const newUrl = await shortUrl(url);
  event.reply(`分享此篇文章 
被不同人點閱${config.shareChangeTicketCount}次
可以獲得一次抽獎次數
抽獎次數無上限
加入「秒抽」好友立即抽獎
${newUrl}`);
};

const messageController = (event) => {
  const text = event.message.text;
  try {
    switch (text) {
      case MESSAGE.EVENT_INFO:
        return eventInfoController(event);
      case MESSAGE.LOTTERY:
        return lotteryController(event);
      default:
        return;
    }
  } catch (e) {
    handleBotReplyError(e, evnet);
  }
};

bot.on('message', messageController);

export default bot;

// {"type":"message","replyToken":"5fa1119da3a04f2dbfc5b610e3c4","source":{"userId":"U4510401b3d2b99c117dca0e306d","type":"user"},"timestamp":1504331479027,"message":{"type":"text","id":"6635924625955","text":"取得活動網址"}}
