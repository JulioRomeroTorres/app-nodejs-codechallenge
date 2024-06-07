import { Inject, Logger } from "@nestjs/common";
import { ITransactionMySqlRepository } from "@src/domain/repository/TransactionMySqlRepository";
import { CustomException } from "../exception/Exception";
import { ERROR_MESSAGE } from "../constants/ErrorConstants";
import { DbTransactionInfo, TransactionInfo } from "@src/domain/interface/DbTransactionInfo";
import { InsertDbInfo } from "@src/domain/entities/InsertDbInfo";


export class TransactionService {
  constructor(
    @Inject(Logger) private readonly logger: Logger,
    @Inject('TransactionDb') private readonly mysqlDb: ITransactionMySqlRepository
  ) {}
  async createTransaction(transactionInfo: InsertDbInfo): Promise<void>{
    try{
      const transactionInfoDb = {
        accountDebitId: transactionInfo.accountExternalDebitId,
        accountCreditId: transactionInfo.accountExternalCreditId,
        statusTransaction: transactionInfo.statusTransaction,
        transferType: transactionInfo.transferTypeId,
        value: transactionInfo.value,
        externalId: transactionInfo.externalId
      } as DbTransactionInfo;
      await this.mysqlDb.createTransaction(transactionInfoDb);
    }catch(error){
      Logger.log('error', error);
      throw new CustomException({
        httpStatus: ERROR_MESSAGE.ERROR_CREATE_TRANSACTION.code,
        message: ERROR_MESSAGE.ERROR_CREATE_TRANSACTION.message
      })
    }
  }

  async updateStatusTransaction(externalId: string, status: string): Promise<TransactionInfo>{
    const transactionInfo = await this.mysqlDb.getInfoTransaction(externalId);
    console.log('data', transactionInfo)
    await this.mysqlDb.updateStatusTransaction({
      statusTransaction: status,
      externalId
    });
    transactionInfo.statusTransaction = status;
    return transactionInfo;
  }

  async getStatusTransaction(externalId: string){
    const transactionInfo = await this.mysqlDb.getInfoTransaction(externalId);
    return transactionInfo
  }
}