const DEBUG = process.env.NODE_ENV !== 'production';
const PORT = process.env.PORT || 8080;
const { CDN_PATH } = process.env;

module.exports = {
  DEBUG,
  PORT,
  CDN_PATH,
};
