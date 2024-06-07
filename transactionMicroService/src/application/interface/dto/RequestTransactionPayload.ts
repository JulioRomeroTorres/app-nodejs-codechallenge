export interface RequestTransactionPayload {
  accountDebitId: string;
  accountCreditId: string;
  statusTransaction: string;
  transferType: number;  
}