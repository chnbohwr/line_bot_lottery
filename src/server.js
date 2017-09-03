import express from 'express';
import lineBot from './linebot';
import { getAccessToken, getUserProfile } from './lineAuth';
import config from '../config/config';
import { Share } from './db';

const app = express();

app.post('/line', lineBot.parser());

app.get('/le', async (req, res) => {
  console.log(req.query);
  const code = req.query.code;
  const shareUserId = req.query.state;
  try {
    const accessData = await getAccessToken(code);
    const userData = await getUserProfile(accessData.access_token);
    const clickUserId = userData.userId;
    Share.update({ shareUserId, clickUserId }, { shareUserId, clickUserId, createAt: new Date() }, { upsert: true });
    lineBot.push(shareUserId, '有人看到你的分享了');
    res.redirect(config.officialUrl);
  } catch (e) {
    console.error(e);
    res.send('error');
  }
});

app.listen(3000);
console.log('port 3000');
