module.exports = {
  ci: {
    collect: {
      method: 'node',
      url: [process.env.APP_URL],
      settings: {
        chromeFlags: '--no-sandbox',
      },
    },
  },
}
