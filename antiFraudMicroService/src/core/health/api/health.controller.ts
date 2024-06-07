import { Controller, Get, HttpCode, Inject, Logger } from "@nestjs/common";
import { ITransactionMySqlRepository } from "@src/domain/repository/TransactionMySqlRepository";

@Controller("health")
export class HealthController {
  constructor(
    @Inject(Logger) private readonly logger: Logger,
    @Inject('TransactionDb') private readonly mysqlDb: ITransactionMySqlRepository
  ) {}

  @Get()
  @HttpCode(200)
  async run() {
    this.logger.log("Health endpoint called!");
    try{
      await this.mysqlDb.createTransaction({
        accountCreditId: '12ddasdsa234',
        accountDebitId: '788dasdsa8',
        statusTransaction: 'dsada',
        transferType: 1
      });
      return { status: "ok" };
    }catch(error){
      console.log('Error', error);
    }
  }
}
