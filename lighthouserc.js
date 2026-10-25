module.exports = {
  ci: {
    collect: {
      staticDistDir: './frontend/dist',
      isSinglePageApplication: true,
    },
    upload: {
      target: 'temporary-public-storage',
    },
  },
}
