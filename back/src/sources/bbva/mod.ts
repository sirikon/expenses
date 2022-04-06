import {
  SourceBase,
  SourceCredsSchemeBase,
  Transaction,
} from "@/core/models.ts";
import { BBVAAuth, BBVACredentials, BBVARawTransaction } from "./models.ts";
import * as api from "./api.ts";

export class BBVASource implements SourceBase<BBVACredentials, BBVAAuth> {
  readonly id = "bbva";
  readonly name = "BBVA";
  readonly credsScheme: SourceCredsSchemeBase<BBVACredentials> = {
    username: "text",
    password: "password",
  };

  login = api.login;
  collect = collect;
  refine = refine;
}

async function collect(
  auth: BBVAAuth,
): Promise<{ id: string; data: BBVARawTransaction }[]> {
  return await getTransactions(auth, await getAccountContracts(auth));
}

function refine(data: BBVARawTransaction): Transaction | null {
  if (
    data.scheme.category.id === "0067" ||
    data.scheme.category.id === "0153"
  ) { // Transfer between accounts
    return null;
  }

  return {
    id: data.id,
    amount: data.amount.amount,
    description: data.cardTransactionDetail?.shop.name ||
      (data.humanConceptName &&
        `${data.humanConceptName}: ${data.humanExtendedConceptName}`) ||
      data.name,
    timestamp: Math.floor(new Date(data.transactionDate).getTime() / 1000),
    data,
  };
}

async function getAccountContracts(auth: BBVAAuth): Promise<string[]> {
  const data = (await api.getPositions(auth)).positions
    .reduce((result, position) => [
      ...result,
      ...(position.contract.account ? [position.contract.account.id] : []),
    ], [] as string[]);

  return [...new Set(data)];
}

async function getTransactions(
  auth: BBVAAuth,
  contracts: string[],
): Promise<{ id: string; data: BBVARawTransaction }[]> {
  const pageSize = 40;
  let paginationKey: string | null = "0";
  const transactions: BBVARawTransaction[] = [];
  while (paginationKey !== null) {
    const result = await api.getTransactions(
      auth,
      contracts,
      pageSize,
      paginationKey,
    );
    transactions.push(...result.accountTransactions);
    paginationKey = getNextPaginationKey(result);
  }

  return transactions.map((t) => ({
    id: t.id,
    data: t,
  }));
}

function getNextPaginationKey(
  result: Awaited<ReturnType<typeof api.getTransactions>>,
) {
  const nextPage = result.pagination.nextPage;
  if (!nextPage) return null;
  const paginationKey = nextPage.split("paginationKey=")[1].split("&")[0];
  return paginationKey;
}
