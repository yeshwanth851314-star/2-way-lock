import { Router, Response } from 'express';
import { authMiddleware, requireAccountType } from '@/middleware/auth';
import { asyncHandler } from '@/middleware/errorHandler';
import { sendSuccess, sendCreated, sendPaginated, sendError } from '@/utils/response';
import jobService from '@/services/job.service';
import { AuthenticatedRequest } from '@/types';

const router = Router();

// Create Job Listing
router.post(
  '/',
  authMiddleware,
  requireAccountType('COMPANY'),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized');
    }

    const listing = await jobService.createListing(req.user.userId, req.body);
    sendCreated(res, listing, 'Job listing created');
  })
);

// Get Job Listings
router.get(
  '/',
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const pageSize = parseInt(req.query.pageSize as string) || 20;

    const result = await jobService.getListings(req.query, page, pageSize);
    sendPaginated(res, result.items, result.total, result.page, result.pageSize);
  })
);

// Get Job Details
router.get(
  '/:jobId',
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    const listing = await jobService.getListingById(req.params.jobId);
    sendSuccess(res, listing);
  })
);

// Update Job Listing
router.put(
  '/:jobId',
  authMiddleware,
  requireAccountType('COMPANY'),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized');
    }

    const listing = await jobService.updateListing(req.params.jobId, req.user.userId, req.body);
    sendSuccess(res, listing, 'Job listing updated');
  })
);

// Delete Job Listing
router.delete(
  '/:jobId',
  authMiddleware,
  requireAccountType('COMPANY'),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized');
    }

    const result = await jobService.deleteListing(req.params.jobId, req.user.userId);
    sendSuccess(res, result);
  })
);

// Apply to Job
router.post(
  '/:jobId/apply',
  authMiddleware,
  requireAccountType('INDIVIDUAL', 'STUDENT'),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized');
    }

    const application = await jobService.applyToJob(req.params.jobId, req.user.userId, req.body);
    sendCreated(res, application, 'Application submitted');
  })
);

// Get Applications for Job
router.get(
  '/:jobId/applications',
  authMiddleware,
  requireAccountType('COMPANY'),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized');
    }

    const page = parseInt(req.query.page as string) || 1;
    const result = await jobService.getApplications(req.params.jobId, req.user.userId, page);
    sendPaginated(res, result.items, result.total, result.page, result.pageSize);
  })
);

// Update Application Status
router.put(
  '/:jobId/applications/:appId/status',
  authMiddleware,
  requireAccountType('COMPANY'),
  asyncHandler(async (req: AuthenticatedRequest, res: Response) => {
    if (!req.user) {
      return sendError(res, 401, 'Unauthorized');
    }

    const { status } = req.body;
    const application = await jobService.updateApplicationStatus(req.params.appId, req.user.userId, status);
    sendSuccess(res, application, 'Application status updated');
  })
);

export default router;
