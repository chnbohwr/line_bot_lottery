import request from 'request-promise-native';
import requestDebug from 'request-debug';
import config from '../config/config';
if (process.env.NODE_ENV !== 'production') {
  requestDebug(request);
}

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
    return userData;
  } catch (e) {
    throw e;
  }
};
