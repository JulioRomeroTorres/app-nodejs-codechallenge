export enum TRANSACTION_STATUS {
  APRROVED = 'approved',
  REJECTED = 'rejected'
}

export const HTTP_STATUS = {
  BAD_REQUEST: 422,
  INTERNAL_SERVER_ERROR: 500,
  NOT_FOUND: 404,
  SUCCESS: 200
}

export const KAFKA_CONSUMER_ID = 'ms-consumer';
export const KAFKA_TOPIC = 'yape-challenge'
export const KAFKA_REPLY_TOPIC = 'yape-challenge-reply';
export const BROKER_KAFKA_URL = process.env.KAFKA_URL || 'localhost:9092';