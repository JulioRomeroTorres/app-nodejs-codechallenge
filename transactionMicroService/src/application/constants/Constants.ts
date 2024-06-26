export const HTTP_STATUS = {
  BAD_REQUEST: 422,
  INTERNAL_SERVER_ERROR: 500,
  NOT_FOUND: 404,
  SUCCESS: 200
}

export const BROKER_KAFKA_URL = process.env.KAFKA_URL || 'localhost:9092';