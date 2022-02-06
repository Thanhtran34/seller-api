// Create personal logger with winston
import { createLogger, format, transports } from 'winston'

const { combine, timestamp, errors } = format
const myFormat = format.printf(info => {
  const log = `${info.timestamp} ${info.level}: ${info.message}`

  return info.stack ? `${log}\n${info.stack}` : log
})

export const logger = createLogger({
  format: combine(
    format.colorize(),
    timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    errors({ stack: true }),
    myFormat
  ),
  transports:
    process.env.NODE_ENV === 'production'
      ? [
          new transports.File({ filename: 'error.log', level: 'error' }),
          new transports.File({ filename: 'combined.log' }),
        ]
      : [new transports.Console()],

  exceptionHandlers:
    process.env.NODE_ENV === 'production'
      ? [new transports.File({ filename: 'exceptions.log' })]
      : null,
})