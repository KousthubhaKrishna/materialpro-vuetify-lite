module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  publicPath: '/',
  devServer: {
    proxy: {
      "api/": {
        target: process.env.API_URL || "http://localhost:3080"
      },
      "files/": {
        target: process.env.API_URL || "https://cdc-file-server.herokuapp.com"
      },
    }
  },
}