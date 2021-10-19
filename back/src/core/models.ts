export type Transaction = {
  id: string;
  description: string;
  shopId: string;
  amount: number;
  date: Date;
};

export type SourceCreds = { [key: string]: string };
export type SourceAuth = Record<string, unknown>;

type SourceCredsSchemeValues = "text" | "password"
export type SourceCredsScheme = { [key: string]: SourceCredsSchemeValues };
export type SourceCredsSchemeBase<TCreds extends SourceCreds> = { [key in keyof TCreds]: SourceCredsSchemeValues }

export type Source = {
  readonly id: string;
  readonly name: string;
  readonly credsScheme: SourceCredsScheme;

  login(creds: SourceCreds): Promise<SourceAuth>;
};

export abstract class SourceBase<
  TCreds extends SourceCreds,
  TAuth extends SourceAuth,
> implements Source {
  abstract id: string;
  abstract name: string;
  abstract credsScheme: { [key in keyof TCreds]: "text" | "password" };
  abstract login(creds: TCreds): Promise<TAuth>;
}
