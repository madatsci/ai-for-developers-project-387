module.exports = {
  ci: {
    collect: {
      method: 'node',
      url: [process.env.APP_URL],
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
