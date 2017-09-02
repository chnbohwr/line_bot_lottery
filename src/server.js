import express from 'express';
import botMiddleware from './linebot';
const app = express();
app.post('/line', botMiddleware);
app.listen(3000);
console.log('port 3000');
