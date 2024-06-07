import { Inject, Logger } from "@nestjs/common";
import { RequestAntiFraudPayload } from "../interface/dto/RequestAntiFraudPayload";
import { ResponseAntiFraudPayload } from "../interface/dto/ResponseAntiFraudPayload";
import { STATUS_TRANSACTION } from "@src/domain/constants/AppConstants";

export class AntiFraudService {
  constructor(
    @Inject(Logger) private readonly logger: Logger
  ) {}
  validateTransaction( payload: RequestAntiFraudPayload ): ResponseAntiFraudPayload {
    const { idTransaction, value } = payload;
    const statusTransaction: string = value > 1000 ? STATUS_TRANSACTION.REJECTED : STATUS_TRANSACTION.APPROVED;
    const responseAntifraudSystem = {
      idTransaction,
      statusTransaction
    };

    return responseAntifraudSystem;
  }

}