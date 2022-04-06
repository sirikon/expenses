import { BBVAAuth, BBVACredentials, BBVARawTransaction } from "./models.ts";

const BASE_URL = "https://www.bbva.es/ASO";

export async function login(credentials: BBVACredentials): Promise<BBVAAuth> {
  const response = await fetchApi({
    method: "POST",
    path: "/TechArchitecture/grantingTickets/V02",
    body: {
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
  });
  return {
    tsec: response.headers.get("tsec")!,
    userId: (await response.json()).user.id,
  };
}

export function getPositions(auth: BBVAAuth) {
  return fetchApi({
    method: "GET",
    path:
      `/financialDashBoard/V03/?$customer.id=${auth.userId}&$filter=(hasSicav==false;showPending==true)`,
    auth,
  }).then((r) =>
    r.json() as Promise<{
      positions: {
        contract: {
          account?: {
            id: string;
          };
        };
      }[];
    }>
  );
}

export function getTransactions(
  auth: BBVAAuth,
  contracts: string[],
  pageSize: number,
  paginationKey: string,
) {
  return fetchApi({
    method: "POST",
    path:
      `/accountTransactions/V02/accountTransactionsAdvancedSearch?paginationKey=${paginationKey}&pageSize=${pageSize}`,
    body: {
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
    },
    auth,
  }).then((r) =>
    r.json() as Promise<{
      accountTransactions: BBVARawTransaction[];
      pagination: {
        nextPage?: string;
      };
    }>
  );
}

async function fetchApi(
  args: {
    method: "GET" | "POST";
    path: string;
    body?: unknown;
    auth?: BBVAAuth;
  },
) {
  const body = args.body ? JSON.stringify(args.body) : null;
  const response = await fetch(`${BASE_URL}${args.path}`, {
    method: args.method,
    body,
    headers: {
      ...(body && {
        "Content-Type": "application/json",
        "Content-Length": body.length.toString(),
      }),
      ...(args.auth && {
        tsec: args.auth.tsec,
      }),
    },
  });
  if (response.status >= 400) {
    throw new Error(`API Request failed with status code ${response.status}`);
  }
  return response;
}
