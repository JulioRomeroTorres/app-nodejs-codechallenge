import { Controller, Get, HttpCode, Inject, Logger, Post } from "@nestjs/common";
import { TransactionService } from "@src/application/service/TransactionService";
import { ValidatorService } from "@src/application/service/ValidatorService";
import { ITransactionMySqlRepository } from "@src/domain/repository/TransactionMySqlRepository";

@Controller("transaction")
export class TransactionController {
  constructor(
    private readonly validatorService: ValidatorService,
    private readonly transactionService: TransactionService
  ) {}

  @Post('/create')
  async createTransaction() {
    try{

    }catch(error){

      console.log('Error', error);
    }
  
  }
  
  @Post('/status')
  async getStatusTransaction(){

  }
}
