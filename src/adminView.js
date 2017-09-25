import express from 'express';
import { Ticket, Share } from './db';
import moment from 'moment';
const adminViewRouter = express.Router();
const checkLogin = (req, res, next) => {
  if (!req.session.admin) {
    res.redirect('/admin/login');
  } else {
    next();
  }
};
adminViewRouter.get('/', checkLogin, async (req, res) => {
  const tickets = await Ticket.find({ bingo: true });
  const daily_report = await Share.aggregate({
    $group: {
      _id: { $dateToString: { format: '%Y-%m-%d', date: '$createAt' } },
      count: { $sum: 1 },
    },
  });
  res.render('admin/index', { tickets, moment, daily_report });
});
adminViewRouter.get('/login', (req, res) => res.render('admin/login', { loginInfo: req.flash('loginInfo') }));
export default adminViewRouter;
