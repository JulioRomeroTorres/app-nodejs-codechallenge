import { Module } from "@nestjs/common";

import { TransactionMySqlRepository } from "@src/infrastructure/repository/TransactionMySqlRepository";
import { TransactionController } from "./TransactionController";
import { ValidatorService } from "@src/application/service/ValidatorService";
import { TransactionService } from "@src/application/service/TransactionService";

@Module({
  controllers: [TransactionController],
  providers: [
    ValidatorService,
    TransactionService,
    {
      provide: 'TransactionDb',
      useClass: TransactionMySqlRepository
    }
  ]
})
export class TransactionModule {}
