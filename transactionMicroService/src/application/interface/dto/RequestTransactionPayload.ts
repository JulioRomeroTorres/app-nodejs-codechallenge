import { ApiProperty } from "@nestjs/swagger";

export interface RequestTransactionPayload {
  accountExternalDebitId: string;
  accountExternalCreditId: string;
  transferTypeId: number;
  value: number;  
}

export class RequestTransactionPayloadDto implements RequestTransactionPayload{
  @ApiProperty()
  accountExternalDebitId: string;

  @ApiProperty()
  accountExternalCreditId: string;

  @ApiProperty()
  transferTypeId: number;

  @ApiProperty()
  value: number;
}
