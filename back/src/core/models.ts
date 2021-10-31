export type Transaction = {
  id: string;
  source: string;
  shop: string;
  description: string;
  amount: number;
  timestamp: number;
};

export type SourceCreds = { [key: string]: string };
export type SourceAuth = Record<string, unknown>;

type SourceCredsSchemeValues = "text" | "password";
export type SourceCredsScheme = { [key: string]: SourceCredsSchemeValues };
export type SourceCredsSchemeBase<TCreds extends SourceCreds> = {
  [key in keyof TCreds]: SourceCredsSchemeValues;
};
export type SourceLoginResult<T> =
  | { error: null; auth: T }
  | { error: string; auth: null };

export type Source = {
  readonly id: string;
  readonly name: string;
  readonly credsScheme: SourceCredsScheme;

  login(creds: SourceCreds): Promise<SourceLoginResult<SourceAuth>>;
};

export abstract class SourceBase<
  TCreds extends SourceCreds,
  TAuth extends SourceAuth,
> implements Source {
  abstract id: string;
  abstract name: string;
  abstract credsScheme: SourceCredsSchemeBase<TCreds>;
  abstract login(creds: TCreds): Promise<SourceLoginResult<TAuth>>;
}
