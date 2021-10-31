import { ExContext, ExRouter } from "./models.ts";
import { sources } from "../sources/_index.ts";
import { Source } from "../core/models.ts";
import * as authStore from "../data/authStore.ts";
import * as transactionStore from "../data/transactionStore.ts";

export default (router: ExRouter) => {
  router.get("/api/v1/sources", (ctx) => {
    ctx.response.body = sources;
  });

  router.get("/api/v1/sources/:id", (ctx) => {
    const source = getSourceById(ctx.params.id!);
    source ? replyOK(ctx, source) : replyNotFound(ctx);
  });

  router.post("/api/v1/sources/:id/login", async (ctx) => {
    const source = getSourceById(ctx.params.id!);
    if (!source) return replyNotFound(ctx);

    const creds = ctx.request.body();
    if (creds.type !== "json") return replyBadRequest(ctx);

    const result = await source.login(await creds.value);
    if (result.error != null) return replyBadRequest(ctx, result.error);

    await authStore.save(source.id, result.data);
    return replyOK(ctx);
  });

  router.post("/api/v1/sources/:id/collect", async (ctx) => {
    const source = getSourceById(ctx.params.id!);
    if (!source) return replyNotFound(ctx);

    const auth = await authStore.get(source.id);
    if (auth == null) return replyBadRequest(ctx, "Not logged in");

    const result = await source.collect(auth);
    if (result.error != null) return replyBadRequest(ctx, result.error);

    await transactionStore.saveTransactionsData(source.id, result.data);
    return replyOK(ctx);
  });
};

function getSourceById(id: string): Source | null {
  const matchingSources = sources.filter((s) => s.id === id);
  return matchingSources.length > 0 ? matchingSources[0] : null;
}

function replyOK(ctx: ExContext, body?: Record<string, unknown>) {
  ctx.response.status = 200;
  ctx.response.body = body;
}

function replyNotFound(ctx: ExContext) {
  ctx.response.status = 404;
}

function replyBadRequest(ctx: ExContext, message?: string) {
  ctx.response.status = 400;
  ctx.response.body = { message };
}
