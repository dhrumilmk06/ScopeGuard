import { Request, Response, NextFunction } from 'express';
import { AuthService } from './authService';

export class AuthController {
  // POST /api/auth/signup
  static async signup(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password, fullName, role, phoneNumber } = req.body;

      // Validate input
      if (!email || !password || !fullName) {
        return res.status(400).json({
          error: 'Email, password, and fullName are required',
        });
      }

      const result = await AuthService.signup({
        email,
        password,
        fullName,
        role,
        phoneNumber,
      });

      res.status(201).json(result);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }

  // POST /api/auth/login
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      // Validate input
      if (!email || !password) {
        return res.status(400).json({
          error: 'Email and password are required',
        });
      }

      const result = await AuthService.login({ email, password });

      res.status(200).json(result);
    } catch (error: any) {
      res.status(401).json({ error: error.message });
    }
  }

  // GET /api/auth/me
  static async getMe(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const user = await AuthService.getUserById(userId);

      res.status(200).json(user);
    } catch (error: any) {
      res.status(404).json({ error: error.message });
    }
  }

  // PUT /api/auth/profile
  static async updateProfile(req: Request, res: Response, next: NextFunction) {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      const { fullName, phoneNumber } = req.body;

      const user = await AuthService.updateUser(userId, {
        fullName,
        phoneNumber,
      });

      res.status(200).json(user);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  }
}
