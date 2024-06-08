import { Module } from "@nestjs/common";

import { AntiFraudController } from "./AntiFraudController";
import { ValidatorService } from "@src/application/service/ValidatorService";
import { AntiFraudService } from "@src/application/service/AntiFraudService";
import { ClientKafka, ClientsModule, Transport } from "@nestjs/microservices";
import { BROKER_KAFKA_URL } from "@src/application/constants/Constants";

@Module({
  imports: [
    ClientsModule.register(
      [
        {
          name: 'KAFKA',
          transport: Transport.KAFKA,
          options: {
            client: {
              brokers : [ BROKER_KAFKA_URL ]
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
