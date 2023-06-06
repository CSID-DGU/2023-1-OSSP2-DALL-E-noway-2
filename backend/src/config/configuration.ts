export default () => ({
  port: parseInt(process.env.PORT, 10),
  beHost: process.env.BE_HOST,
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
  database: {
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    port: parseInt(process.env.DATABASE_PORT, 10),
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_DATABASE,
  },
  openai: {
    host: process.env.OPENAI_HOST,
    organizationID: process.env.OPENAI_ORGANIZATION_ID,
    apiKey: process.env.OPENAI_API_KEY,
  },
});
