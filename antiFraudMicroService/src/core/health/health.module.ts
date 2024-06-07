import { Module } from "@nestjs/common";

import { HealthController } from "./api/health.controller";
import { TransactionMySqlRepository } from "@src/infrastructure/repository/TransactionMySqlRepository";

@Module({
  controllers: [HealthController],
  providers: [
    {
      provide: 'TransactionDb',
      useClass: TransactionMySqlRepository
    }
  ]
})
export class HealthModule {}
