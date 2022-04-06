export type Transaction = {
  id: string;
  description: string;
  amount: number;
  timestamp: number;
  data: unknown;
};

export type TransactionLabels = {
  shop: string | null;
  category: string | null;
};

export type SourceCreds = { [key: string]: string };
export type SourceAuth = Record<string, unknown>;

type SourceCredsSchemeValues = "text" | "password";
export type SourceCredsScheme = { [key: string]: SourceCredsSchemeValues };
export type SourceCredsSchemeBase<TCreds extends SourceCreds> = {
  [key in keyof TCreds]: SourceCredsSchemeValues;
};
export type Result<T> =
  | { error: null; data: T }
  | { error: string; data: null };

export type Source = {
  readonly id: string;
  readonly name: string;
  readonly credsScheme: SourceCredsScheme;

  login(creds: SourceCreds): Promise<Result<SourceAuth>>;
  collect(auth: SourceAuth): Promise<Result<{ id: string; data: unknown }[]>>;
  refine(data: unknown): Transaction | null;
};

export abstract class SourceBase<
  TCreds extends SourceCreds,
  TAuth extends SourceAuth,
> implements Source {
  abstract id: string;
  abstract name: string;
  abstract credsScheme: SourceCredsSchemeBase<TCreds>;
  abstract login(creds: TCreds): Promise<Result<TAuth>>;
  abstract collect(
    auth: TAuth,
  ): Promise<Result<{ id: string; data: unknown }[]>>;
  abstract refine(data: unknown): Transaction | null;
}
