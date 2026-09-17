import bcryptjs from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../../config/database';
import config from '../../config/environment';

interface SignupInput {
  email: string;
  password: string;
  fullName: string;
  role?: 'FREELANCER' | 'CLIENT';
  phoneNumber?: string;
}

interface LoginInput {
  email: string;
  password: string;
}

interface TokenPayload {
  id: string;
  email: string;
  role: string;
}

export class AuthService {
  // Generate JWT token
  static generateToken(payload: TokenPayload, expiresIn: string = config.jwtExpiry): string {
    return jwt.sign(payload, config.jwtSecret, { expiresIn });
  }

  // Verify JWT token
  static verifyToken(token: string): TokenPayload {
    try {
      const decoded = jwt.verify(token, config.jwtSecret) as TokenPayload;
      return decoded;
    } catch (error) {
      throw new Error('Invalid or expired token');
    }
  }

  // Hash password
  static async hashPassword(password: string): Promise<string> {
    const salt = await bcryptjs.genSalt(10);
    return bcryptjs.hash(password, salt);
  }

  // Compare password
  static async comparePassword(password: string, hash: string): Promise<boolean> {
    return bcryptjs.compare(password, hash);
  }

  // Signup (Register)
  static async signup(input: SignupInput) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (existingUser) {
      throw new Error('User already exists');
    }

    // Validate password strength
    if (input.password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    // Hash password
    const passwordHash = await this.hashPassword(input.password);

    // Create user
    const user = await prisma.user.create({
      data: {
        email: input.email,
        passwordHash,
        fullName: input.fullName,
        role: input.role || 'FREELANCER',
        phoneNumber: input.phoneNumber,
      },
    });

    // Generate token
    const token = this.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    // Return user + token (never return password hash!)
    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        phoneNumber: user.phoneNumber,
      },
      token,
    };
  }

  // Login
  static async login(input: LoginInput) {
    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: input.email },
    });

    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Compare password
    const isPasswordValid = await this.comparePassword(input.password, user.passwordHash);

    if (!isPasswordValid) {
      throw new Error('Invalid email or password');
    }

    // Generate token
    const token = this.generateToken({
      id: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        phoneNumber: user.phoneNumber,
      },
      token,
    };
  }

  // Get user by ID
  static async getUserById(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
    });

    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      phoneNumber: user.phoneNumber,
    };
  }

  // Update user
  static async updateUser(id: string, updates: { fullName?: string; phoneNumber?: string }) {
    const user = await prisma.user.update({
      where: { id },
      data: updates,
    });

    return {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      phoneNumber: user.phoneNumber,
    };
  }
}
