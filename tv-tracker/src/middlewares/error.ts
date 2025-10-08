import { Request, Response, NextFunction } from 'express';
import { logger } from '../utils/logger';

export function error(err: any, req: Request, res: Response, next: NextFunction) {
  logger.error(err?.message || err);
  res.status(500).json({ error: 'Internal server error' });
}
