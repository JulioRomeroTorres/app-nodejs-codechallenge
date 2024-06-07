import { DbTransactionInfo } from "../interface/DbTransactionInfo";

export interface ITransactionMySqlRepository {
  createTable(): Promise<void>;
  setParamsQuery( args: { query: string, params?: Record<string, any>} ): string;
  createTransaction( args: DbTransactionInfo ): Promise<void>;
  updateStatusTransaction( 
    args: { 
      statusTransaction: boolean,
      accountDebitId: string,
      accountCreditId: string
    }
  ): Promise<void>;
}