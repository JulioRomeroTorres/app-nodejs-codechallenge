import { ResponseTransactionPayload } from "../interface/dto/ResponseTransactionPayload"

export const createResponseTransaction = (
  args: {
    externalId: string,
    transferType: number,
    statusTransaction: string,
    createdDate?: string,
    valueTransaction: number
  }): ResponseTransactionPayload => {
  const { 
    externalId, transferType, 
    statusTransaction, createdDate = new Date().toISOString(),
    valueTransaction
  } = args;

  return {
    transactionExternalId: externalId,
    transactionType: {
      name: String(transferType)
    },
    transactionStatus: {
      name: statusTransaction
    },
    value: valueTransaction,
    createdAt: createdDate
  } as ResponseTransactionPayload
}