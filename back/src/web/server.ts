import { Application, Router, send } from "oak/mod.ts";
import { ApplicationListenEvent } from "oak/application.ts";
import routes from "./routes.ts";

export default async () => {
  const app = new Application();
  const router = new Router();

  app.use(async (ctx, next) => {
    ctx.response.headers.set("Access-Control-Allow-Origin", "*");
    ctx.response.headers.set("Access-Control-Allow-Headers", "*");
    await next();
  });
  routes(router);
  app.use(router.routes());
  app.use(router.allowedMethods());

  const frontStaticAssets = Deno.env.get("FRONT_STATIC_ASSETS");
  if (frontStaticAssets != null) {
    app.use(async (ctx) => {
      if (ctx.request.url.pathname === "/favicon.ico") {
        ctx.response.status = 404;
        return;
      }
      await send(ctx, ctx.request.url.pathname, {
        root: frontStaticAssets,
        index: "index.html",
      });
    });
  }

  app.addEventListener("listen", onListen);
  await app.listen({ hostname: "0.0.0.0", port: 8000 });
};

function onListen(e: ApplicationListenEvent) {
  console.log(`Listening on http://127.0.0.1:${e.port}`);
}
