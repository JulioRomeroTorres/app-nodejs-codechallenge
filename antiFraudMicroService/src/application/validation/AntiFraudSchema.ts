import Joi from 'joi';

export const AntiFraudSchema = Joi.object({
  idTransaction: Joi.string().required(),
  value: Joi.number().min(-1000).max(9999999).required()
})