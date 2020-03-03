const Koa = require("koa");
const Router = require("koa-router");
const next = require("next");
const session = require("koa-session");
const Redis = require("ioredis");
const KoaBody = require("koa-body");
const atob = require('atob');


const dev = process.env.NODE_ENV !== "production";
const app = next({ dev });
const handle = app.getRequestHandler();

const auth = require("./server/auth");
const api = require("./server/api");

const RedisSessionStore = require("./server/session-store");

// 创建redis client
const redis = new Redis();

// 设置nodejs全局atob方法
global.atob = atob;

app.prepare().then(() => {
  const server = new Koa();
  const router = new Router();

  server.keys = ["ZedCoding develop Github App"];
  server.use(KoaBody());

  const SESSION_CONFIG = {
    key: "jid",
    store: new RedisSessionStore(redis)
  };
  server.use(session(SESSION_CONFIG, server));

  // 配置github OAuth登录
  auth(server);
  api(server);

  // 获取用户信息
  router.get("/api/user/info", async ctx => {
    const user = ctx.session.userInfo;
    if (!user) {
      ctx.status = 401;
      ctx.body = "Need Login";
    } else {
      ctx.body = user;
      ctx.set("Content-Type", "application/json");
    }
  });

  server.use(router.routes());

  server.use(async (ctx, next) => {
    ctx.req.session = ctx.session;
    await handle(ctx.req, ctx.res);
    ctx.respond = false;
  });

  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200;
    await next();
  });

  server.listen(3000, () => {
    console.log("Koa Server is listening on port 3000");
  });
});
