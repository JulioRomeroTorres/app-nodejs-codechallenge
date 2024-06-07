export interface DbTransactionInfo{
  accountDebitId: string;
  accountCreditId: string;
  statusTransaction: string;
  transferType: number;
  value: number;
  externalId: string;
}

export interface TransactionInfo extends DbTransactionInfo {
  createdAt: string;
}