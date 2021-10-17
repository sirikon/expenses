import { Application, Router } from "oak/mod.ts";

export default async () => {

  const app = new Application();
  const router = new Router();

  router.get('/', (ctx) => {
    ctx.response.body = "Hello World!";
  })

  app.use(router.routes())
  app.use(router.allowedMethods());

  console.log("Listening http://127.0.0.1:8000")
  await app.listen({ port: 8000 });

}
