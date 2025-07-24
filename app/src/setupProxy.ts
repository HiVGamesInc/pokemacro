const { createProxyMiddleware } = require("http-proxy-middleware");

module.exports = function (app: any) {
  app.use(
    createProxyMiddleware(
      [
        "/anti-logout",
        "/alert",
        "/healing",
        "/auto-combo",
        "/update-combo",
        "/save-config",
        "/load-config",
        "/auto-catch",
        "/crop-image",
        "/list-images",
        "/delete-image",
        "/rename-image",
        "/toggle-mouse-tracking",
        "/get-mouse-coords",
        "/auto-revive",
        "/todo",
      ],
      {
        target: "http://127.0.0.1:5000",
        changeOrigin: true,
      }
    )
  );
};
