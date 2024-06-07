import { Module } from "@nestjs/common";

import { TransactionMySqlRepository } from "@src/infrastructure/repository/TransactionMySqlRepository";
import { TransactionController } from "./TransactionController";
import { ValidatorService } from "@src/application/service/ValidatorService";
import { TransactionService } from "@src/application/service/TransactionService";
import { ClientKafka, ClientProxy, ClientsModule, Transport } from "@nestjs/microservices";

@Module({
  imports: [
    ClientsModule.register(
      [
        {
          name: 'KAFKA',
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers : [ 'localhost:9092' as string ]
            }
          }
        }
      ]
    )
  ],
  controllers: [TransactionController],
  providers: [
    ValidatorService,
    TransactionService,
    ClientKafka,
    {
      provide: 'TransactionDb',
      useClass: TransactionMySqlRepository
    }
  ]
})
export class TransactionModule {}
