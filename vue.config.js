module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  publicPath: '/',
  devServer: {
    proxy: {
      "api/": {
        target: "http://localhost:3080"
      },
      "files/": {
        target: "http://localhost:8888"
      }
    }
  },
}