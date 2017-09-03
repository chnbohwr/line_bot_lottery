import { Share } from './db';
import { getAccessToken, getUserProfile } from './lineAuth';
import lineBot from './linebot';
import config from './config/config';

export default async (req, res) => {
  const code = req.query.code;
  const shareUserId = req.query.state;
  try {
    const accessData = await getAccessToken(code);
    const userData = await getUserProfile(accessData.access_token);
    const clickUserId = userData.userId;
    Share.update({ shareUserId, clickUserId }, { shareUserId, clickUserId, createAt: new Date() }, { upsert: true });
    // lineBot.push(shareUserId, '有人看到你的分享了');
    res.redirect(config.officialUrl);
  } catch (e) {
    console.error(e);
    res.send('error');
  }
};
