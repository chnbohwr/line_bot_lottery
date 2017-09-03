import request from 'request-promise-native';
import config from '../config/config';

export const getAccessToken = async (code) => {
  const formData = {
    grant_type: 'authorization_code',
    client_id: process.env.LOGIN_CHANNEL_ID,
    client_secret: process.env.LOGIN_CHANNEL_SECRET,
    code,
    redirect_uri: config.redirectUrl,
  };
  try {
    const data = await request.post(config.accessTokenUrl).form(formData);
    return JSON.parse(data);
  } catch (e) {
    throw e;
  }
};

export const getUserProfile = async (accessToken) => {
  const option = {
    url: config.profileUrl,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  };
  try {
    const userData = await request.get(option);
    return JSON.parse(userData);
  } catch (e) {
    throw e;
  }
};
