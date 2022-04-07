import { sources } from "../sources/_index.ts";
import { Categorization, Source } from "../core/models.ts";
import * as authStore from "../data/authStore.ts";
import * as transactionStore from "../data/transactionStore.ts";
import * as categorizationStore from "../data/categorizationStore.ts";
import { Response, Router } from "oak/mod.ts";

export default (router: Router) => {
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
    await authStore.save(source.id, result);
    return replyOK(ctx);
  });

  router.post("/api/v1/sources/:id/collect", async (ctx) => {
    const source = getSourceById(ctx.params.id!);
    if (!source) return replyNotFound(ctx);

    const auth = await authStore.get(source.id);
    if (auth == null) return replyBadRequest(ctx, "Not logged in");

    const result = await source.collect(auth);

    await transactionStore.saveRawTransactions(source.id, result);
    return replyOK(ctx);
  });

  router.get("/api/v1/categorization", async (ctx) => {
    return replyOK(ctx, await categorizationStore.get());
  });

  router.post("/api/v1/categorization", async (ctx) => {
    const categorization = ctx.request.body();
    if (categorization.type !== "json") return replyBadRequest(ctx);

    await categorizationStore.save(
      (await categorization.value) as unknown as Categorization,
    );
    return replyOK(ctx);
  });

  router.get("/api/v1/transactions", async (ctx) => {
    const categorization = await categorizationStore.get();
    return replyOK(
      ctx,
      transactionStore.queryTransactions(categorization),
    );
  });

  router.post("/api/v1/transactions/populate", async (ctx) => {
    await transactionStore.resetDb();
    for (const source of sources) {
      const transactionIds = await transactionStore.getRawTransactionIds(
        source.id,
      );
      for (const transactionId of transactionIds) {
        const transaction = source.refine(
          await transactionStore.getRawTransactionData(
            source.id,
            transactionId,
          ),
        );
        if (transaction == null) continue;
        transactionStore.saveTransaction(source.id, transaction);
      }
    }
    return replyOK(ctx);
  });
};

function getSourceById(id: string): Source | null {
  const matchingSources = sources.filter((s) => s.id === id);
  return matchingSources.length > 0 ? matchingSources[0] : null;
}

// deno-lint-ignore ban-types
function replyOK(ctx: { response: Response }, body?: object) {
  ctx.response.status = 200;
  ctx.response.body = body;
}

function replyNotFound(ctx: { response: Response }) {
  ctx.response.status = 404;
}

function replyBadRequest(ctx: { response: Response }, message?: string) {
  ctx.response.status = 400;
  ctx.response.body = { message };
}
