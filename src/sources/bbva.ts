export interface Credentials {
    username: string;
    password: string;
}

export interface Auth {
    tsec: string;
    userId: string;
}

export async function login(credentials: Credentials): Promise<Auth> {
    const response = await apiRequest(
        'POST',
        'https://www.bbva.es/ASO/TechArchitecture/grantingTickets/V02',
        {
            "authentication": {
                "consumerID": "00000001",
                "authenticationType": "02",
                "userID": "0019-0" + credentials.username,
                "authenticationData": [
                    {
                        "authenticationData": [credentials.password],
                        "idAuthenticationData": "password"
                    }
                ]
            }
        });
    return {
        tsec: response.headers.get('tsec')!,
        userId: (await response.json()).user.id
    }
}

export async function getAccountContracts(auth: Auth): Promise<any[]> {
    const response = await apiRequest(
        'GET',
        `https://www.bbva.es/ASO/financialDashBoard/V03/?$customer.id=${auth.userId}&$filter=(hasSicav==false;showPending==true)`,
        null,
        { tsec: auth.tsec }
    )
    const data = await response.json();

    const accountContracts = data.positions
        .filter((p: any) => p.contract.account)
        .map((p: any) => p.contract.account.id)

    return [...new Set(accountContracts)];
}

async function apiRequest(method: string, url: string, body: any, headers: HeadersInit = {}) {
    const requestBody = body ? JSON.stringify(body) : null;
    const response = await fetch(url, {
        method,
        body: requestBody,
        headers: {
            ...(requestBody && {
                'Content-Type': 'application/json',
                'Content-Length': requestBody.length.toString()
            }),
            ...headers
        }
    })
    if (response.status >= 400 && response.status < 500) {
        throw new Error(`API Request failed with status code ${response.status}`);
    }
    return response;
}
