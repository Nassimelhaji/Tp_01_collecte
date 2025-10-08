import { Request, Response, NextFunction } from 'express';
export interface ReqUser { id: string; role: 'admin'|'user'; }
export function mockAuth(req: Request, res: Response, next: NextFunction) {
  const userId = (req.headers['x-user-id'] as string) || 'anonymous';
  const userRole = (req.headers['x-user-role'] as string) === 'admin' ? 'admin' : 'user';
  (req as any).user = { id: userId, role: userRole } as ReqUser;
  next();
}
export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const user = (req as any).user as ReqUser | undefined;
  if (!user || user.role !== 'admin') return res.status(403).json({ error: 'Admin role required' });
  next();
}

