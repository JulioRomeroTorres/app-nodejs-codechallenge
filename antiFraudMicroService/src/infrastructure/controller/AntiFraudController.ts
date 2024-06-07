import { Body, Controller, Inject, Post } from "@nestjs/common";
import { ClientKafka, MessagePattern } from "@nestjs/microservices";
import { KAFKA_REPLY_TOPIC, KAFKA_TOPIC } from "@src/application/constants/Constants";
import { CustomException } from "@src/application/exception/Exception";
import { RequestAntiFraudPayload } from "@src/application/interface/dto/RequestAntiFraudPayload";
import { ResponseAntiFraudPayload } from "@src/application/interface/dto/ResponseAntiFraudPayload";
import { AntiFraudService } from "@src/application/service/AntiFraudService";
import { ValidatorService } from "@src/application/service/ValidatorService";
import { AntiFraudSchema } from "@src/application/validation/AntiFraudSchema";

@Controller("antifraud")
export class AntiFraudController {
  constructor(
    private readonly validatorService: ValidatorService,
    private readonly antifraudService: AntiFraudService,
    @Inject('KAFKA') private readonly kafkaClient: ClientKafka
  ) {}

  async onModuleInit() {
    await this.kafkaClient.connect();
  }

  @MessagePattern(KAFKA_TOPIC)
  async validTransaction(@Body() payload: RequestAntiFraudPayload): Promise<ResponseAntiFraudPayload> {
    try{
      this.validatorService.validate( AntiFraudSchema , payload);
      const responseAntifraudSystem = this.antifraudService.validateTransaction(payload);

      await this.kafkaClient.emit(KAFKA_REPLY_TOPIC, JSON.stringify(responseAntifraudSystem));

      return responseAntifraudSystem;
    }catch(error:any){
      throw new CustomException(
        { 
          message: error.response,
          httpStatus: error.status 
        }
      );
    }
  }
}
