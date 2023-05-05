export default () => ({
  port: parseInt(process.env.PORT, 10),
  feHost: process.env.FE_HOST,
  jwt: {
    secret: process.env.JWT_SECRET,
    expiresIn: process.env.JWT_EXPIRESIN,
  },
  kakao: {
    clientID: process.env.KAKAO_CLIENT_ID,
    clientSecret: process.env.KAKAO_CLIENT_SECRET,
    adminKey: process.env.KAKAO_ADMIN_KEY,
    callbackURL: process.env.KAKAO_CALLBACK_URL,
  },
  naver: {
    clientID: process.env.NAVER_CLIENT_ID,
    clientSecret: process.env.NAVER_CLIENT_SECRET,
    callbackURL: process.env.NAVER_CALLBACK_URL,
  },
  google: {
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL,
  },
  debug: {
    log: process.env.DEBUG_LOG === 'true' ? true : false,
  },
});
