import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { LoggerModule } from "@shared/logger/logger.module";
import { TransactionModule } from "../controller/TransactionModule";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    LoggerModule,
    TransactionModule,
  ],
})
export class AppModule {}
