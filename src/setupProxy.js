const { createProxyMiddleware } = require("http-proxy-middleware");

const TUNNEL_URL = "https://heading-ecommerce-ids-minor.trycloudflare.com"; // ganti sesuai tunnel kamu

module.exports = function (app) {
  app.use(
    "/raspi",
    createProxyMiddleware({
      target: TUNNEL_URL,
      changeOrigin: true,
      pathRewrite: {
        "^/raspi": "",
      },
    })
  );
};
