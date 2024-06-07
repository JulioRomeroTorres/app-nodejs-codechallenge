export interface RequestTransactionPayload {
  accountExternalDebitId: string;
  accountExternalCreditId: string;
  transferTypeId: number;
  value: number;  
}