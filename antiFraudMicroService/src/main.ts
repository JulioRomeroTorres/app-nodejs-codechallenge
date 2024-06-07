import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";

import { AppModule } from "./infrastructure/bootstrap/app.module";
import { GlobalExceptionsFilter } from "./application/exception/GlobalExceptionsFilter";
import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { KAFKA_CONSUMER_ID } from "./application/constants/Constants";

async function bootstrap() {
  const brokerKafa = process.env.KAFKA_URL || 'localhost:9092'
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.KAFKA,
      options: {
        client: {
          brokers: [brokerKafa],
        },
        consumer: {
          groupId: KAFKA_CONSUMER_ID,
        },
      },
    }
  );
  app.useGlobalFilters(new GlobalExceptionsFilter());
  const portServer = process.env.PORT_ANTIFRAUD_MICROSERVICE || "7000";
  const configService = app.get(ConfigService);
  const port = configService.get<string>("PORT", portServer);

  await app.listen();

  const logger = app.get(Logger);
  logger.log(`App is ready and listening on port ${port} 🚀`);
}

bootstrap().catch(handleError);

function handleError(error: unknown) {
  console.error(error);
  process.exit(1);
}

process.on("uncaughtException", handleError);
