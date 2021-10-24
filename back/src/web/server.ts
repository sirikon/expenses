import { Application, Router } from "oak/mod.ts";
import { ApplicationListenEvent } from "oak/application.ts";
import { ExApp, ExRouter } from "./models.ts";
import routes from "./routes.ts";

export default async () => {
  const app: ExApp = new Application();
  const router: ExRouter = new Router();

  routes(router);
  app.use(router.routes());
  app.use(router.allowedMethods());

  app.addEventListener("listen", onListen);
  await app.listen({ hostname: "0.0.0.0", port: 8000 });
};

function onListen(e: ApplicationListenEvent) {
  console.log(`Listening on http://127.0.0.1:${e.port}`);
}
