import { Inject, Logger } from "@nestjs/common";
import { ITransactionMySqlRepository } from "@src/domain/repository/TransactionMySqlRepository";


export class TransactionService {
  constructor(
    @Inject(Logger) private readonly logger: Logger,
    @Inject('TransactionDb') private readonly mysqlDb: ITransactionMySqlRepository
  ) {}

}