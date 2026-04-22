import { prisma } from '@/config/database';
import { NotFoundError, ForbiddenError } from '@/types';
import { getPaginationParams } from '@/types';

export class JobService {
  async createListing(giverId: string, data: any) {
    const listing = await prisma.jobListing.create({
      data: {
        giverId,
        title: data.title,
        type: data.type,
        workMode: data.workMode,
        location: data.location,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        salaryCurrency: data.salaryCurrency || 'USD',
        salaryNegotiable: data.salaryNegotiable || false,
        experienceYears: data.experienceYears,
        experienceLevel: data.experienceLevel,
        description: data.description,
        perksAndBenefits: data.perksAndBenefits,
        interviewProcess: data.interviewProcess,
        assessmentRequired: data.assessmentRequired || false,
        assessmentDescription: data.assessmentDescription,
        visaSponsorshipAvailable: data.visaSponsorshipAvailable || false,
        deadline: new Date(data.deadline),
        openings: data.openings || 1,
        status: 'ACTIVE',
      },
      include: {
        giver: {
          include: { profile: true },
        },
      },
    });

    return listing;
  }

  async getListings(filters: any, page: number = 1, pageSize: number = 20) {
    const { skip, pageSize: ps } = getPaginationParams(page, pageSize);

    const where: any = {
      status: 'ACTIVE',
      deadline: {
        gt: new Date(),
      },
    };

    if (filters.type) {
      where.type = { in: Array.isArray(filters.type) ? filters.type : [filters.type] };
    }

    if (filters.workMode) {
      where.workMode = { in: Array.isArray(filters.workMode) ? filters.workMode : [filters.workMode] };
    }

    if (filters.location) {
      where.location = { contains: filters.location, mode: 'insensitive' };
    }

    if (filters.salaryMin) {
      where.salaryMax = { gte: filters.salaryMin };
    }

    if (filters.salaryMax) {
      where.salaryMin = { lte: filters.salaryMax };
    }

    const [listings, total] = await Promise.all([
      prisma.jobListing.findMany({
        where,
        skip,
        take: ps,
        include: {
          giver: {
            include: { profile: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.jobListing.count({ where }),
    ]);

    return {
      items: listings,
      total,
      page,
      pageSize: ps,
      totalPages: Math.ceil(total / ps),
    };
  }

  async getListingById(listingId: string) {
    const listing = await prisma.jobListing.findUnique({
      where: { id: listingId },
      include: {
        giver: {
          include: { profile: true },
        },
        applications: {
          include: {
            seeker: {
              include: { profile: true },
            },
          },
        },
      },
    });

    if (!listing) {
      throw new NotFoundError('Job listing not found');
    }

    return listing;
  }

  async updateListing(listingId: string, giverId: string, data: any) {
    const listing = await prisma.jobListing.findUnique({
      where: { id: listingId },
    });

    if (!listing || listing.giverId !== giverId) {
      throw new ForbiddenError('Not authorized to update this listing');
    }

    const updated = await prisma.jobListing.update({
      where: { id: listingId },
      data: {
        title: data.title,
        description: data.description,
        salaryMin: data.salaryMin,
        salaryMax: data.salaryMax,
        deadline: data.deadline ? new Date(data.deadline) : undefined,
        status: data.status,
      },
    });

    return updated;
  }

  async deleteListing(listingId: string, giverId: string) {
    const listing = await prisma.jobListing.findUnique({
      where: { id: listingId },
    });

    if (!listing || listing.giverId !== giverId) {
      throw new ForbiddenError('Not authorized to delete this listing');
    }

    await prisma.jobListing.delete({
      where: { id: listingId },
    });

    return { message: 'Listing deleted' };
  }

  async applyToJob(listingId: string, seekerId: string, data: any) {
    // Check if already applied
    const existing = await prisma.application.findUnique({
      where: {
        listingId_seekerId: {
          listingId,
          seekerId,
        },
      },
    });

    if (existing) {
      throw new Error('Already applied to this job');
    }

    const application = await prisma.application.create({
      data: {
        listingId,
        seekerId,
        status: 'APPLIED',
        coverLetter: data.coverLetter,
        customAnswers: data.customAnswers ? JSON.stringify(data.customAnswers) : null,
      },
      include: {
        seeker: {
          include: { profile: true },
        },
        listing: true,
      },
    });

    return application;
  }

  async getApplications(listingId: string, giverId: string, page: number = 1) {
    const { skip, pageSize } = getPaginationParams(page, 20);

    const listing = await prisma.jobListing.findUnique({
      where: { id: listingId },
    });

    if (!listing || listing.giverId !== giverId) {
      throw new ForbiddenError('Not authorized');
    }

    const [applications, total] = await Promise.all([
      prisma.application.findMany({
        where: { listingId },
        skip,
        take: pageSize,
        include: {
          seeker: {
            include: { profile: true },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.application.count({ where: { listingId } }),
    ]);

    return {
      items: applications,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async updateApplicationStatus(appId: string, giverId: string, status: string) {
    const app = await prisma.application.findUnique({
      where: { id: appId },
      include: { listing: true },
    });

    if (!app || app.listing.giverId !== giverId) {
      throw new ForbiddenError('Not authorized');
    }

    const updated = await prisma.application.update({
      where: { id: appId },
      data: {
        status: status as any,
        viewedAt: status !== 'APPLIED' ? new Date() : app.viewedAt,
        shortlistedAt: status === 'SHORTLISTED' ? new Date() : app.shortlistedAt,
        interviewAt: status === 'INTERVIEW' ? new Date() : app.interviewAt,
        offeredAt: status === 'OFFERED' ? new Date() : app.offeredAt,
        rejectedAt: status === 'REJECTED' ? new Date() : app.rejectedAt,
      },
    });

    return updated;
  }
}

export default new JobService();
