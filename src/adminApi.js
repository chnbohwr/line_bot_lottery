import express from 'express';
import bodyParser from 'body-parser';
import { Admin, Ticket } from './db';
const adminApiRouter = express.Router();
const checkLogin = (req, res, next) => {
  if (!req.session.admin) {
    res.redirect('/admin/login');
  } else {
    next();
  }
};
adminApiRouter.post('/login', bodyParser.urlencoded(), async (req, res) => {
  const { username, password } = req.body;
  const userdata = await Admin.findOne({ username, password });
  if (userdata) {
    req.session.admin = true;
    res.redirect('/admin');
  } else {
    req.flash('loginInfo', '帳號密碼錯誤');
    res.redirect('/admin/login');
  }
});
adminApiRouter.get('/logout', (req, res) => {
  req.session.admin = false;
  res.redirect('/admin/login');
});
adminApiRouter.post('/exchangeTicket', checkLogin, bodyParser.urlencoded(), async (req, res) => {
  const ticketId = req.body.ticketId;
  await Ticket.update({ ticketId }, { $set: { updateAt: new Date() } });
  res.redirect('/admin');
});

export default adminApiRouter;
