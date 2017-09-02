import express from 'express';
import botMiddleware, { bot } from './linebot';
import { getAccessToken, getUserProfile } from './lineAuth';
import config from '../config/config';

import qs from 'qs';
import monk from 'monk';
const db = monk(process.env.db || 'localhost/meowdraw');
const Share = db.get('share');
const app = express();

app.post('/line', botMiddleware);

app.get('/le', async (req, res) => {
  console.log(req.query);
  const code = req.query.code;
  const shareUserId = req.query.state;
  try {
    const accessData = await getAccessToken(code);
    const userData = await getUserProfile(accessData.access_token);
    const clickUserId = userData.userId;
    const shareCount = await Share.count({ shareUserId, clickUserId });
    if (shareCount === 0) {
      Share.insert({
        shareUserId,
        clickUserId,
        createAt: new Date(),
      });
      bot.push(shareUserId, '有人看到你的分享了');
    }
    res.redirect(config.officialUrl);
  } catch (e) {
    console.error(e);
    res.send('error');
  }
});

app.listen(3000);
console.log('port 3000');
