import { Module } from "@nestjs/common";
import { ConfigModule } from "@nestjs/config";

import { LoggerModule } from "@shared/logger/logger.module";
import { AntiFraudModule } from "../controller/AntiFraudModule";

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, cache: true }),
    LoggerModule,
    AntiFraudModule,
  ],
})
export class AppModule {}
