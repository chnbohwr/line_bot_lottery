import express from 'express';
const adminViewRouter = express.Router();
adminViewRouter.get('/', (req, res) => res.render('admin/index'));
adminViewRouter.get('/login', (req, res) => res.render('admin/login'));
export default adminViewRouter;
