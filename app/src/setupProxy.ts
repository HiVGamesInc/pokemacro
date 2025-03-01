const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app: any) {
  app.use(
    createProxyMiddleware("/", {
      target: "http://localhost:5000",
      changeOrigin: true,
    })
  );
};
