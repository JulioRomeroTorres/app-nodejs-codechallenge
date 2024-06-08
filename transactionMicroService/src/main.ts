import { Logger } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { NestFactory } from "@nestjs/core";
import {
  FastifyAdapter,
  NestFastifyApplication,
} from "@nestjs/platform-fastify";

import { AppModule } from "./infrastructure/bootstrap/app.module";
import { GlobalExceptionsFilter } from "./application/exception/GlobalExceptionsFilter";
import { Transport } from "@nestjs/microservices";
import { DocumentBuilder, SwaggerModule } from "@nestjs/swagger";

async function bootstrap() {
  const app = await NestFactory.create<NestFastifyApplication>(
    AppModule,
    new FastifyAdapter(),
  );
  app.connectMicroservice(
    {
      transport: Transport.KAFKA,
      options: {
        suscribe: {
          fromBeginning: true
        },
        consumer: {
          groupId: process.env.KAFKA_CONSUMER_ID
        },
        client: {
          brokers: [process.env.KAFKA_URL as string]
        }
      }
    });
  app.startAllMicroservices();
  app.useGlobalFilters(new GlobalExceptionsFilter());

  const portServer = process.env.PORT_TRANSACTION_MICROSERVICE || "6000";
  const configService = app.get(ConfigService);
  const port = configService.get<string>("PORT", portServer);

  const config = new DocumentBuilder()
    .setTitle('Yape Challenge')
    .setDescription('Catálogo de Endpoints construidos para el reto')
    .setVersion('1.0')
    .addTag('apis')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('docs', app, document);

  await app.listen(port, "0.0.0.0");

  const logger = app.get(Logger);
  logger.log(`App is ready and listening on port ${port} 🚀`);
}

bootstrap().catch(handleError);

function handleError(error: unknown) {
  console.error(error);
  process.exit(1);
}

process.on("uncaughtException", handleError);
