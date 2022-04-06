// deno-lint-ignore-file no-explicit-any
import {
  Result,
  SourceBase,
  SourceCredsSchemeBase,
  Transaction,
} from "@/core/models.ts";

const BASE_URL = "https://www.bbva.es/ASO";

type BBVACredentials = {
  username: string;
  password: string;
};

type BBVAAuth = {
  tsec: string;
  userId: string;
};

type BBVARawTransaction = {
  id: string;
  name: string;
  humanConceptName?: string;
  humanExtendedConceptName?: string;
  cardTransactionDetail?: {
    shop: { name: string };
  };
  amount: { amount: number };
  transactionDate: string;
};

export class BBVASource implements SourceBase<BBVACredentials, BBVAAuth> {
  readonly id = "bbva";
  readonly name = "BBVA";
  readonly credsScheme: SourceCredsSchemeBase<BBVACredentials> = {
    username: "text",
    password: "password",
  };

  login = login;
  collect = collect;
  refine = refine;
}

async function login(
  credentials: BBVACredentials,
): Promise<Result<BBVAAuth>> {
  try {
    const response = await apiRequest(
      "POST",
      buildUrl("/TechArchitecture/grantingTickets/V02"),
      {
        "authentication": {
          "consumerID": "00000001",
          "authenticationType": "02",
          "userID": "0019-0" + credentials.username,
          "authenticationData": [
            {
              "authenticationData": [credentials.password],
              "idAuthenticationData": "password",
            },
          ],
        },
      },
    );
    return {
      error: null,
      data: {
        tsec: response.headers.get("tsec")!,
        userId: (await response.json()).user.id,
      },
    };
  } catch (_) {
    return {
      error: "Login failed",
      data: null,
    };
  }
}

async function collect(
  auth: BBVAAuth,
): Promise<Result<{ id: string; data: unknown }[]>> {
  try {
    const contracts = await getAccountContracts(auth);
    return {
      error: null,
      data: await getTransactions(auth, contracts),
    };
  } catch (_) {
    return {
      error: "Collection failed",
      data: null,
    };
  }
}

function refine(data: BBVARawTransaction): Transaction {
  return {
    id: data.id,
    amount: data.amount.amount,
    description: data.cardTransactionDetail?.shop.name ||
      (data.humanConceptName &&
        `${data.humanConceptName}: ${data.humanExtendedConceptName}`) ||
      data.name,
    timestamp: Math.floor(new Date(data.transactionDate).getTime() / 1000),
  };
}

async function getAccountContracts(auth: BBVAAuth): Promise<string[]> {
  const response = await apiRequest(
    "GET",
    buildUrl(
      `/financialDashBoard/V03/?$customer.id=${auth.userId}&$filter=(hasSicav==false;showPending==true)`,
    ),
    null,
    { tsec: auth.tsec },
  );
  const data = await response.json();

  const accountContracts: string[] = data.positions
    .filter((p: any) => p.contract.account)
    .map((p: any) => p.contract.account.id);

  return [...new Set(accountContracts)];
}

async function getTransactions(
  auth: BBVAAuth,
  contracts: string[],
): Promise<{ id: string; data: unknown }[]> {
  const pageSize = 40;
  let paginationKey = "0";
  const transactions = [];
  while (paginationKey !== null) {
    const result = await getTransactionsPage(
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

async function getTransactionsPage(
  auth: BBVAAuth,
  contracts: string[],
  pageSize: number,
  paginationKey: string,
) {
  const path = buildUrl(
    `/accountTransactions/V02/accountTransactionsAdvancedSearch?paginationKey=${paginationKey}&pageSize=${pageSize}`,
  );
  const response = await apiRequest("POST", path, {
    "accountContracts": contracts.map((c) => {
      return { contract: { id: c } };
    }),
    "customer": {
      "id": auth.userId,
    },
    "searchText": null,
    "orderField": "DATE_FIELD",
    "orderType": "DESC_ORDER",
    "filter": {
      "amounts": {
        "from": null,
        "to": null,
      },
      "dates": {
        "from": null,
        "to": null,
      },
      "operationType": null,
    },
  }, { tsec: auth.tsec });
  return response.json();
}

function getNextPaginationKey(result: any) {
  const nextPage = result.pagination.nextPage;
  if (!nextPage) return null;
  const paginationKey = nextPage.split("paginationKey=")[1].split("&")[0];
  return paginationKey;
}

async function apiRequest(
  method: string,
  url: string,
  body: unknown,
  headers: HeadersInit = {},
) {
  const requestBody = body ? JSON.stringify(body) : null;
  const response = await fetch(url, {
    method,
    body: requestBody,
    headers: {
      ...(requestBody && {
        "Content-Type": "application/json",
        "Content-Length": requestBody.length.toString(),
      }),
      ...headers,
    },
  });
  if (response.status >= 400 && response.status < 500) {
    throw new Error(`API Request failed with status code ${response.status}`);
  }
  return response;
}

function buildUrl(path: string) {
  return `${BASE_URL}${path}`;
}
