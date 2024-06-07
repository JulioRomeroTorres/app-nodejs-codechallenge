import { DbTransactionInfo, TransactionInfo } from "../interface/DbTransactionInfo";

export interface ITransactionMySqlRepository {
  createTable(): Promise<void>;
  setParamsQuery( args: { query: string, params?: Record<string, any>} ): string;
  createTransaction( args: DbTransactionInfo ): Promise<void>;
  updateStatusTransaction( 
    args: { 
      statusTransaction: string,
      externalId: string
    }
  ): Promise<void>;
  getInfoTransaction(externalInd: string): Promise<TransactionInfo>;
}