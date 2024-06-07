interface DescriptionKey {
  name: string
}
export interface ResponseTransactionPayload {
  transactionExternalId: string,
  transactionType: DescriptionKey,
  transactionStatus: DescriptionKey,
  value: number,
  createdAt: string
}