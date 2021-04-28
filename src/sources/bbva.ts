export interface Auth {
    tsec: any;
    loginResult: any;
}

export async function login(username: string, password: string): Promise<Auth> {
    const response = await apiRequest(
        'POST',
        'https://www.bbva.es/ASO/TechArchitecture/grantingTickets/V02',
        {
            "authentication": {
                "consumerID": "00000001",
                "authenticationType": "02",
                "userID": "0019-0" + username,
                "authenticationData": [
                    {
                        "authenticationData": [password],
                        "idAuthenticationData": "password"
                    }
                ]
            }
        });
    return {
        tsec: response.headers.get('tsec'),
        loginResult: await response.json()
    }
}

export async function getAccountContracts(auth: Auth): Promise<any[]> {
    const response = await apiRequest(
        'GET',
        `https://www.bbva.es/ASO/financialDashBoard/V03/?$customer.id=${auth.loginResult.user.id}&$filter=(hasSicav==false;showPending==true)`,
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
