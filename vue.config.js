module.exports = {
  "transpileDependencies": [
    "vuetify"
  ],
  publicPath: '/',
  outputDir: "/Users/kousthu/Projects/test/CDC-CBIT/server/public",
  devServer: {
    proxy: {
      "api/": {
        target: process.env.API_URL || "http://localhost:3080"
      },
    }
  },
}