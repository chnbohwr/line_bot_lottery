export default {
  loginUrl: 'https://access.line.me/dialog/oauth/weblogin',
  redirectUrl: process.env.REDIRECT_URL,
  accessTokenUrl: 'https://api.line.me/v2/oauth/accessToken',
  profileUrl: 'https://api.line.me/v2/profile',
  officialUrl: 'https://www.meowdraw.com.tw/',
  shareChangeTicketCount: 1,
  ticketProbability: 80, // 20%
};
