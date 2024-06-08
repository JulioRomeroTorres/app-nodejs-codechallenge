import { Body, Controller, Get, HttpCode, Inject, Logger, OnModuleInit, Param, Post } from "@nestjs/common";
import { TransactionService } from "@src/application/service/TransactionService";
import { ValidatorService } from "@src/application/service/ValidatorService";
import { ClientKafka, Transport, Client, ClientProxy, MessagePattern } from '@nestjs/microservices';
import { CustomException } from "@src/application/exception/Exception";
import { RequestTransactionPayload, RequestTransactionPayloadDto } from "@src/application/interface/dto/RequestTransactionPayload";
import { ResponseTransactionPayload, ResponseTransactionPayloadDto } from "@src/application/interface/dto/ResponseTransactionPayload";
import { KAFKA_TOPIC_REPLY, STATUS_TRANSACTION } from "@src/domain/constants/AppConstants";
import { TransactionSchema } from "@src/application/validation/TransactionSchema";
import { createResponseTransaction } from "@src/application/utils/Utils";
import { RequestAntiFraudPayload } from "@src/application/interface/dto/RequestAntiFraudPayload";
import { ResponseAntiFraudPayload } from "@src/application/interface/dto/ResponseAntiFraudPayload";
import { ApiBody, ApiResponse, ApiTags } from "@nestjs/swagger";
const { v4: uuidv4 } = require('uuid');

@ApiTags("transaction")
@Controller("transaction")
export class TransactionController {
  private topic: string;
  private topicReply: string;
  constructor(
    private readonly validatorService: ValidatorService,
    private readonly transactionService: TransactionService,
    @Inject('KAFKA') private readonly kafkaClient: ClientKafka
  ){
    this.topic = process.env.KAFKA_TOPIC as string;
    this.topicReply = process.env.KAFKA_REPLY_TOPIC as string;
  }

  async onModuleInit() {
    await this.kafkaClient.connect();
  }
  
  @Post('/create')
  @ApiBody({ type:  RequestTransactionPayloadDto})
  @ApiResponse({ status: 201, type: ResponseTransactionPayloadDto })
  async createTransaction(@Body() requestCreateTransaction: RequestTransactionPayload): Promise<ResponseTransactionPayload> {
    try{
      this.validatorService.validate(TransactionSchema, requestCreateTransaction);

      const uuidTransaction:string = uuidv4();
      const statusTransaction = STATUS_TRANSACTION.PENDING;
      
      await this.transactionService.createTransaction({ ...requestCreateTransaction, externalId: uuidTransaction, statusTransaction});
      
      const requestAntiFraud: RequestAntiFraudPayload = {
        idTransaction: uuidTransaction,
        value: requestCreateTransaction.value
      }
      
      const responseSendKafka = await this.kafkaClient.emit(this.topic, JSON.stringify(requestAntiFraud));
      console.log('ResponseKafka', JSON.stringify(responseSendKafka))
      return createResponseTransaction({
        externalId: uuidTransaction,
        transferType: requestCreateTransaction.transferTypeId,
        statusTransaction,
        valueTransaction: requestCreateTransaction.value
      });
    }catch(error: any){
      throw new CustomException({
        httpStatus: error.status,
        message: error.message
      });
    }
  }
  @MessagePattern(KAFKA_TOPIC_REPLY)
  async getTopicStatusTransaction(@Body() params: ResponseAntiFraudPayload ){
    console.log('Listen to topic', params);
    try{
      const status = params.statusTransaction;
      const transactionInfo = await this.transactionService.updateStatusTransaction(params.idTransaction, status);

      return createResponseTransaction(
        {
          externalId: transactionInfo.externalId,
          transferType: transactionInfo.transferType,
          statusTransaction: transactionInfo.statusTransaction,
          valueTransaction: transactionInfo.value,
          createdDate: transactionInfo.createdAt
        }
      );
    }catch(error){
      throw new CustomException({
        httpStatus: 500,
        message: 'Error al Obtener'
      });
    }
  }

  @Get(':idTransaction')
  async getStatusTransaction(@Param('idTransaction') idTransaction: string ){
    try{
      const transactionInfo = await this.transactionService.getStatusTransaction(idTransaction);

      return createResponseTransaction(
        {
          externalId: transactionInfo.externalId,
          transferType: transactionInfo.transferType,
          statusTransaction: transactionInfo.statusTransaction,
          valueTransaction: transactionInfo.value,
          createdDate: transactionInfo.createdAt
        }
      );
    }catch(error){
      throw new CustomException({
        httpStatus: 500,
        message: 'Error al Obtener'
      });
    }
  }

}
