import { ApiProperty } from "@nestjs/swagger";

interface DescriptionKey {
  name: string
}

class DescriptionKeyDto implements DescriptionKey {
  @ApiProperty()
  name: string
}

export interface ResponseTransactionPayload {
  transactionExternalId: string,
  transactionType: DescriptionKey,
  transactionStatus: DescriptionKey,
  value: number,
  createdAt: string
}

export class ResponseTransactionPayloadDto implements ResponseTransactionPayload {
  @ApiProperty()
  transactionExternalId: string;

  @ApiProperty()
  transactionType: DescriptionKeyDto;

  @ApiProperty()
  transactionStatus: DescriptionKeyDto;

  @ApiProperty()
  value: number;

  @ApiProperty()
  createdAt: string;
}