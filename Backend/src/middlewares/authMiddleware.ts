import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../features/auth/authService';

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        email: string;
        role: string;
      };
    }
  }
}

// Verify JWT token and attach user to request
export const authMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Missing or invalid authorization header' });
    }

    const token = authHeader.substring(7); // Remove "Bearer " prefix

    const payload = AuthService.verifyToken(token);

    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };

    next();
  } catch (error: any) {
    res.status(401).json({ error: error.message });
  }
};
