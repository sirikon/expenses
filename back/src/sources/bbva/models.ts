export type BBVACredentials = {
  username: string;
  password: string;
};

export type BBVAAuth = {
  tsec: string;
  userId: string;
};

export type BBVARawTransaction = {
  id: string;
  name: string;
  humanConceptName?: string;
  humanExtendedConceptName?: string;
  scheme: {
    category: {
      id: string;
      name: string;
    };
  };
  cardTransactionDetail?: {
    shop: { name: string };
  };
  amount: { amount: number };
  transactionDate: string;
};
