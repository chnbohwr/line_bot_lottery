import express from 'express';
import bodyParser from 'body-parser';
import { Admin } from './db';
const adminApiRouter = express.Router();
adminApiRouter.post('/login', bodyParser.urlencoded(), async (req, res) => {
  console.log(JSON.stringify(req.body));
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
adminApiRouter.post('/logout', (req, res) => {
  req.session.admin = false;
  res.redirect('/admin/login');
});


export default adminApiRouter;
