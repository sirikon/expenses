import { Application, Router } from "oak/mod.ts";
import { ExApp, ExRouter } from "./models.ts";
import routes from "./routes.ts";

export default async () => {
  const app: ExApp = new Application();
  const router: ExRouter = new Router();

  routes(router);
  app.use(router.routes());
  app.use(router.allowedMethods());

  console.log("Listening http://127.0.0.1:8000");
  await app.listen({ port: 8000 });
};
