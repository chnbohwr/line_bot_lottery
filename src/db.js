import monk from 'monk';
const db = monk(process.env.db || 'localhost/line_test_lottery');
export const Share = db.get('share');
export const Ticket = db.get('ticket');
export const Admin = db.get('admin');
