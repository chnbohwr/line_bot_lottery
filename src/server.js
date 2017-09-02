import express from 'express';
import botMiddleware from './linebot';
import monk from 'monk';
const db = monk(process.env.db || 'localhost/meowdraw');
const Share = db.get('share');
const app = express();
app.post('/line', botMiddleware);
app.get('/lotteryEvent', (req, res) => {
  console.log(req.query);
  res.send('ok');
});
app.listen(3000);
console.log('port 3000');
