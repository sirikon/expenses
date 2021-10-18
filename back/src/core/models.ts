export type Transaction = {
  id: string;
  description: string;
  shopId: string;
  amount: number;
  date: Date;
};

export type SourceCreds = { [key: string]: string };
export type SourceCredsScheme<T extends SourceCreds> = {
  [key in keyof T]: "text" | "password";
};

export type TransactionSource<TCredentials extends SourceCreds, TAuth> = {
  readonly id: string;
  readonly name: string;
  readonly credentialsScheme: SourceCredsScheme<TCredentials>;

  login(credentials: TCredentials): Promise<TAuth>;
};
