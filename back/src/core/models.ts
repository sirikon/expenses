export type Transaction = {
  id: string;
  description: string;
  amount: number;
  timestamp: number;
  data: unknown;
};
export type CategorizedTransaction = Transaction & {
  category: string | null;
};

export type SourceCreds = { [key: string]: string };
export type SourceAuth = Record<string, unknown>;

type SourceCredsSchemeValues = "text" | "password";
export type SourceCredsScheme = { [key: string]: SourceCredsSchemeValues };
export type SourceCredsSchemeBase<TCreds extends SourceCreds> = {
  [key in keyof TCreds]: SourceCredsSchemeValues;
};

export type Source = {
  readonly id: string;
  readonly name: string;
  readonly credsScheme: SourceCredsScheme;

  login(creds: SourceCreds): Promise<SourceAuth>;
  collect(auth: SourceAuth): Promise<{ id: string; data: unknown }[]>;
  refine(data: unknown): Transaction | null;
};

export abstract class SourceBase<
  TCreds extends SourceCreds,
  TAuth extends SourceAuth,
> implements Source {
  abstract id: string;
  abstract name: string;
  abstract credsScheme: SourceCredsSchemeBase<TCreds>;
  abstract login(creds: TCreds): Promise<TAuth>;
  abstract collect(
    auth: TAuth,
  ): Promise<{ id: string; data: unknown }[]>;
  abstract refine(data: unknown): Transaction | null;
}

export type Categorization = {
  categoryName: string;
  matchers: {
    query: string;
    condition: "equals" | "like";
    value: string;
  }[];
}[];
