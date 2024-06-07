import Joi from 'joi';
import { VALID_TRANSFER_TYPE_LIST } from './Constants';

export const TransactionSchema = Joi.object({
  accountExternalIdDebit: Joi.string().required(),
  accountExternalIdCredit: Joi.string().required(),
  tranferTypeId: Joi.number().valid(...VALID_TRANSFER_TYPE_LIST).required(),
  value: Joi.number().min(-1000).max(9999999).required()
})