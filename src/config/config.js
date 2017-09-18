export default {
  loginUrl: 'https://access.line.me/dialog/oauth/weblogin',
  redirectUrl: process.env.REDIRECT_URL,
  accessTokenUrl: 'https://api.line.me/v2/oauth/accessToken',
  profileUrl: 'https://api.line.me/v2/profile',
  officialUrl: 'https://line.me/R/ti/p/%40rrs9919t',
  shareChangeTicketCount: 5, // 5 shares change 1 ticket
  ticketProbability: 5, // 5%
  totalTicket: 200, // total send tickets
};
