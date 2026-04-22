import { Router, Request, Response } from 'express';
import { authMiddleware, optionalAuthMiddleware } from '@/middleware/auth';
import { asyncHandler } from '@/middleware/errorHandler';
import { sendSuccess, sendCreated, sendError } from '@/utils/response';
import { validate, registerSchema, loginSchema, refreshTokenSchema } from '@/utils/validation';
import authService from '@/services/auth.service';
import { AuthenticatedRequest } from '@/types';

const router = Router();

// Register
router.post(
  '/register',
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password, accountType } = validate(registerSchema, req.body);

    const result = await authService.register(email, password, accountType);
    sendCreated(res, result, 'Registration successful');
  })
);

// Verify Email
router.post(
  '/verify-email',
  asyncHandler(async (req: Request, res: Response) => {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return sendError(res, 400, 'Email and OTP required');
    }

    const result = await authService.verifyEmail(email, otp);
    sendSuccess(res, result, 'Email verified');
  })
);

// Login
router.post(
  '/login',
  asyncHandler(async (req: Request, res: Response) => {
    const { email, password } = validate(loginSchema, req.body);

    const result = await authService.login(email, password);
    sendSuccess(res, result, 'Login successful');
  })
);

// Google OAuth Callback
router.post(
  '/google',
  asyncHandler(async (req: Request, res: Response) => {
    const { googleId, email, name, picture } = req.body;

    if (!googleId || !email) {
      return sendError(res, 400, 'Google ID and email required');
    }

    const result = await authService.googleAuth(googleId, email, name, picture);
    sendSuccess(res, result, 'Google authentication successful');
  })
);

// Refresh Token
router.post(
  '/refresh',
  asyncHandler(async (req: Request, res: Response) => {
    const { refreshToken } = validate(refreshTokenSchema, req.body);

    const result = await authService.refreshToken(refreshToken);
    sendSuccess(res, result, 'Token refreshed');
  })
);

// Logout
router.post(
  '/logout',
  authMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized');
    }

    const result = await authService.logout(req.user.userId);
    sendSuccess(res, result, 'Logged out successfully');
  })
);

// Forgot Password
router.post(
  '/forgot-password',
  asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.body;

    if (!email) {
      return sendError(res, 400, 'Email required');
    }

    const result = await authService.forgotPassword(email);
    sendSuccess(res, result);
  })
);

// Reset Password
router.post(
  '/reset-password',
  asyncHandler(async (req: Request, res: Response) => {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return sendError(res, 400, 'Token and new password required');
    }

    const result = await authService.resetPassword(token, newPassword);
    sendSuccess(res, result);
  })
);

// Get Current User
router.get(
  '/me',
  authMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized');
    }

    sendSuccess(res, req.user, 'Current user');
  })
);

export default router;
