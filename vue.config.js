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
        target: "https://cdc-file-server.herokuapp.com"
      },
    }
  },
}