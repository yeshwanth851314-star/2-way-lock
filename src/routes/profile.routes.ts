import { Router, Response } from 'express';
import { authMiddleware } from '@/middleware/auth';
import { asyncHandler } from '@/middleware/errorHandler';
import { sendSuccess, sendCreated, sendError } from '@/utils/response';
import profileService from '@/services/profile.service';
import { AuthenticatedRequest } from '@/types';

const router = Router();

// Get Profile
router.get(
  '/:userId',
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const profile = await profileService.getProfile(req.params.userId);
    sendSuccess(res, profile);
  })
);

// Get Current User Profile
router.get(
  '/me',
  authMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized');
    }

    const profile = await profileService.getProfile(req.user.userId);
    sendSuccess(res, profile);
  })
);

// Update Profile
router.put(
  '/',
  authMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized');
    }

    const profile = await profileService.updateProfile(req.user.userId, req.body);
    sendSuccess(res, profile, 'Profile updated');
  })
);

// Add Certification
router.post(
  '/certifications',
  authMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized');
    }

    const cert = await profileService.addCertification(req.user.userId, req.body);
    sendCreated(res, cert, 'Certification added');
  })
);

// Update Certification
router.put(
  '/certifications/:certId',
  authMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized');
    }

    const cert = await profileService.updateCertification(req.params.certId, req.user.userId, req.body);
    sendSuccess(res, cert, 'Certification updated');
  })
);

// Delete Certification
router.delete(
  '/certifications/:certId',
  authMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized');
    }

    const result = await profileService.deleteCertification(req.params.certId, req.user.userId);
    sendSuccess(res, result);
  })
);

// Add Project
router.post(
  '/projects',
  authMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized');
    }

    const project = await profileService.addProject(req.user.userId, req.body);
    sendCreated(res, project, 'Project added');
  })
);

// Update Project
router.put(
  '/projects/:projectId',
  authMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized');
    }

    const project = await profileService.updateProject(req.params.projectId, req.user.userId, req.body);
    sendSuccess(res, project, 'Project updated');
  })
);

// Delete Project
router.delete(
  '/projects/:projectId',
  authMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized');
    }

    const result = await profileService.deleteProject(req.params.projectId, req.user.userId);
    sendSuccess(res, result);
  })
);

// Add Skill
router.post(
  '/skills',
  authMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized');
    }

    const skill = await profileService.addSkill(req.user.userId, req.body);
    sendCreated(res, skill, 'Skill added');
  })
);

// Endorse Skill
router.post(
  '/skills/:skillId/endorse',
  authMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized');
    }

    const skill = await profileService.endorseSkill(req.params.skillId, req.user.userId);
    sendSuccess(res, skill, 'Skill endorsed');
  })
);

// Update Theme
router.put(
  '/theme',
  authMiddleware,
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized');
    }

    const theme = await profileService.updateTheme(req.user.userId, req.body);
    sendSuccess(res, theme, 'Theme updated');
  })
);

export default router;
