import { createLogger, format, transports } from 'winston';
import path from 'path';

const logsDir = path.join(process.cwd(), 'logs');

// But: envoyer action (actions.log) et erreurs (errors.log)
export const logger = createLogger({
  level: 'info',
  format: format.combine(format.timestamp(), format.simple()),
  transports: [
    new transports.Console(),
    new transports.File({ filename: path.join(logsDir, 'actions.log'), level: 'info' }),
    new transports.File({ filename: path.join(logsDir, 'errors.log'), level: 'error' })
  ]
});