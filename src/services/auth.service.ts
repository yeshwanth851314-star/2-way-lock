import bcryptjs from 'bcryptjs';
import { prisma } from '@/config/database';
import { generateTokens, verifyRefreshToken } from '@/utils/jwt';
import { ValidationError, ConflictError, UnauthorizedError, NotFoundError } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { redis } from '@/server';

export class AuthService {
  async register(email: string, password: string, accountType: string) {
    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      throw new ConflictError('Email already registered');
    }

    // Validate password strength
    if (password.length < 8) {
      throw new ValidationError('Password must be at least 8 characters');
    }

    // Hash password
    const passwordHash = bcryptjs.hashSync(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        passwordHash,
        accountType: accountType as any,
        verificationStatus: 'PENDING_REVIEW',
        profile: {
          create: {
            profileScore: 0,
          },
        },
        settings: {
          create: {},
        },
      },
      include: {
        profile: true,
      },
    });

    // Generate OTP
    const otp = Math.random().toString().slice(2, 8);
    await redis.setex(`otp:${email}`, 600, otp); // 10 minutes

    return {
      userId: user.id,
      email: user.email,
      message: 'Registration successful. OTP sent to email.',
    };
  }

  async verifyEmail(email: string, otp: string) {
    // Check OTP
    const storedOtp = await redis.get(`otp:${email}`);
    if (!storedOtp || storedOtp !== otp) {
      throw new UnauthorizedError('Invalid or expired OTP');
    }

    // Update user
    const user = await prisma.user.update({
      where: { email },
      data: {
        verificationStatus: 'VERIFIED',
      },
      include: {
        profile: true,
      },
    });

    // Clear OTP
    await redis.del(`otp:${email}`);

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      accountType: user.accountType,
    });

    // Store refresh token in Redis
    await redis.setex(`refresh:${user.id}`, 604800, tokens.refreshToken); // 7 days

    return {
      user: {
        id: user.id,
        email: user.email,
        accountType: user.accountType,
        verificationStatus: user.verificationStatus,
      },
      ...tokens,
    };
  }

  async login(email: string, password: string) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
      include: {
        profile: true,
      },
    });

    if (!user) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Verify password
    const isPasswordValid = bcryptjs.compareSync(password, user.passwordHash);
    if (!isPasswordValid) {
      throw new UnauthorizedError('Invalid email or password');
    }

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      accountType: user.accountType,
    });

    // Store refresh token in Redis
    await redis.setex(`refresh:${user.id}`, 604800, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        accountType: user.accountType,
        verificationStatus: user.verificationStatus,
        profile: user.profile,
      },
      ...tokens,
    };
  }

  async googleAuth(googleId: string, email: string, name: string, picture: string) {
    // Find or create user
    let user = await prisma.user.findFirst({
      where: {
        OR: [
          { email },
          { id: googleId }, // If we store googleId as user ID
        ],
      },
      include: {
        profile: true,
      },
    });

    if (!user) {
      // Create new user from Google
      user = await prisma.user.create({
        data: {
          id: uuidv4(),
          email,
          passwordHash: '', // No password for OAuth users
          accountType: 'INDIVIDUAL',
          verificationStatus: 'VERIFIED',
          verificationBadge: 'INDIVIDUAL_VERIFIED',
          profile: {
            create: {
              headline: name,
              avatar: picture,
              profileScore: 30,
            },
          },
          settings: {
            create: {},
          },
        },
        include: {
          profile: true,
        },
      });
    } else if (!user.profile) {
      // Create profile if missing
      await prisma.profile.create({
        data: {
          userId: user.id,
          headline: name,
          avatar: picture,
          profileScore: 30,
        },
      });
    }

    // Generate tokens
    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      accountType: user.accountType,
    });

    // Store refresh token in Redis
    await redis.setex(`refresh:${user.id}`, 604800, tokens.refreshToken);

    return {
      user: {
        id: user.id,
        email: user.email,
        accountType: user.accountType,
        verificationStatus: user.verificationStatus,
        profile: user.profile,
      },
      ...tokens,
    };
  }

  async refreshToken(refreshToken: string) {
    // Verify refresh token
    const payload = verifyRefreshToken(refreshToken);

    // Check if token is in Redis
    const storedToken = await redis.get(`refresh:${payload.userId}`);
    if (!storedToken || storedToken !== refreshToken) {
      throw new UnauthorizedError('Invalid refresh token');
    }

    // Generate new tokens
    const tokens = generateTokens({
      userId: payload.userId,
      email: payload.email,
      accountType: payload.accountType,
    });

    // Update refresh token in Redis
    await redis.setex(`refresh:${payload.userId}`, 604800, tokens.refreshToken);

    return tokens;
  }

  async logout(userId: string) {
    // Remove refresh token from Redis
    await redis.del(`refresh:${userId}`);
    return { message: 'Logged out successfully' };
  }

  async forgotPassword(email: string) {
    // Find user
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Don't reveal if email exists
      return { message: 'If email exists, password reset link sent' };
    }

    // Generate reset token
    const resetToken = uuidv4();
    await redis.setex(`reset:${resetToken}`, 3600, user.id); // 1 hour

    // TODO: Send email with reset link
    console.log(`Reset token: ${resetToken}`);

    return { message: 'Password reset link sent to email' };
  }

  async resetPassword(token: string, newPassword: string) {
    // Validate password
    if (newPassword.length < 8) {
      throw new ValidationError('Password must be at least 8 characters');
    }

    // Get user ID from token
    const userId = await redis.get(`reset:${token}`);
    if (!userId) {
      throw new UnauthorizedError('Invalid or expired reset token');
    }

    // Hash new password
    const passwordHash = bcryptjs.hashSync(newPassword, 10);

    // Update user
    await prisma.user.update({
      where: { id: userId },
      data: { passwordHash },
    });

    // Clear reset token
    await redis.del(`reset:${token}`);

    return { message: 'Password reset successful' };
  }
}

export default new AuthService();
