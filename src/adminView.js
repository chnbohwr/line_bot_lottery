import express from 'express';
import { Ticket } from './db';
const adminViewRouter = express.Router();
const checkLogin = (req, res, next) => {
  if (!req.session.admin) {
    res.redirect('/admin/login');
  } else {
    next();
  }
};
adminViewRouter.get('/', checkLogin, async (req, res) => {
  const tickets = await Ticket.find({});
  res.render('admin/index', { tickets });
});
adminViewRouter.get('/login', (req, res) => res.render('admin/login', { loginInfo: req.flash('loginInfo') }));
export default adminViewRouter;
