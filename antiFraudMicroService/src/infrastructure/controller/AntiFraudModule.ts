import { Module } from "@nestjs/common";

import { AntiFraudController } from "./AntiFraudController";
import { ValidatorService } from "@src/application/service/ValidatorService";
import { AntiFraudService } from "@src/application/service/AntiFraudService";
import { ClientKafka, ClientsModule, Transport } from "@nestjs/microservices";

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
  controllers: [AntiFraudController],
  providers: [
    ValidatorService,
    AntiFraudService,
    ClientKafka
  ]
})
export class AntiFraudModule {}
