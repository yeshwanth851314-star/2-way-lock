import { prisma } from '@/config/database';
import { NotFoundError, ValidationError } from '@/types';

export class ProfileService {
  async getProfile(userId: string) {
    const profile = await prisma.profile.findUnique({
      where: { userId },
      include: {
        experiences: true,
        educations: true,
        skills: true,
        themeConfig: true,
      },
    });

    if (!profile) {
      throw new NotFoundError('Profile not found');
    }

    return profile;
  }

  async updateProfile(userId: string, data: any) {
    const profile = await prisma.profile.update({
      where: { userId },
      data: {
        headline: data.headline,
        bio: data.bio,
        location: data.location,
        openToWork: data.openToWork,
        activelyHiring: data.activelyHiring,
        visibility: data.visibility,
        avatar: data.avatar,
        bannerImage: data.bannerImage,
      },
      include: {
        experiences: true,
        educations: true,
        skills: true,
      },
    });

    return profile;
  }

  async addCertification(userId: string, data: any) {
    const certification = await prisma.certification.create({
      data: {
        userId,
        name: data.name,
        issuingBody: data.issuingBody,
        issueDate: new Date(data.issueDate),
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
        credentialId: data.credentialId,
        verificationUrl: data.verificationUrl,
        description: data.description,
        scanStatus: 'CLEAN',
      },
    });

    return certification;
  }

  async updateCertification(certId: string, userId: string, data: any) {
    // Verify ownership
    const cert = await prisma.certification.findUnique({
      where: { id: certId },
    });

    if (!cert || cert.userId !== userId) {
      throw new NotFoundError('Certification not found');
    }

    const updated = await prisma.certification.update({
      where: { id: certId },
      data: {
        name: data.name,
        description: data.description,
        expiryDate: data.expiryDate ? new Date(data.expiryDate) : null,
      },
    });

    return updated;
  }

  async deleteCertification(certId: string, userId: string) {
    const cert = await prisma.certification.findUnique({
      where: { id: certId },
    });

    if (!cert || cert.userId !== userId) {
      throw new NotFoundError('Certification not found');
    }

    await prisma.certification.delete({
      where: { id: certId },
    });

    return { message: 'Certification deleted' };
  }

  async addProject(userId: string, data: any) {
    const project = await prisma.project.create({
      data: {
        userId,
        title: data.title,
        shortDescription: data.shortDescription,
        description: data.description,
        techStack: data.techStack || [],
        startDate: new Date(data.startDate),
        endDate: data.endDate ? new Date(data.endDate) : null,
        ongoing: data.ongoing || false,
        associatedWith: data.associatedWith,
        collaborators: data.collaborators || [],
        githubUrl: data.githubUrl,
        liveDemoUrl: data.liveDemoUrl,
      },
    });

    return project;
  }

  async updateProject(projectId: string, userId: string, data: any) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== userId) {
      throw new NotFoundError('Project not found');
    }

    const updated = await prisma.project.update({
      where: { id: projectId },
      data: {
        title: data.title,
        description: data.description,
        techStack: data.techStack,
        endDate: data.endDate ? new Date(data.endDate) : null,
        ongoing: data.ongoing,
      },
    });

    return updated;
  }

  async deleteProject(projectId: string, userId: string) {
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    });

    if (!project || project.userId !== userId) {
      throw new NotFoundError('Project not found');
    }

    await prisma.project.delete({
      where: { id: projectId },
    });

    return { message: 'Project deleted' };
  }

  async addSkill(userId: string, data: any) {
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundError('Profile not found');
    }

    const skill = await prisma.skill.create({
      data: {
        profileId: profile.id,
        name: data.name,
        proficiencyLevel: data.proficiencyLevel,
      },
    });

    return skill;
  }

  async endorseSkill(skillId: string, endorserId: string) {
    const skill = await prisma.skill.findUnique({
      where: { id: skillId },
    });

    if (!skill) {
      throw new NotFoundError('Skill not found');
    }

    // Check if already endorsed
    if (skill.endorsedBy.includes(endorserId)) {
      throw new ValidationError('Already endorsed this skill');
    }

    const updated = await prisma.skill.update({
      where: { id: skillId },
      data: {
        endorsements: skill.endorsements + 1,
        endorsedBy: [...skill.endorsedBy, endorserId],
      },
    });

    return updated;
  }

  async updateTheme(userId: string, data: any) {
    const profile = await prisma.profile.findUnique({
      where: { userId },
    });

    if (!profile) {
      throw new NotFoundError('Profile not found');
    }

    let themeConfig = await prisma.themeConfig.findUnique({
      where: { profileId: profile.id },
    });

    if (!themeConfig) {
      themeConfig = await prisma.themeConfig.create({
        data: {
          profileId: profile.id,
          preset: data.preset,
          customAccentColor: data.customAccentColor,
          cardStyle: data.cardStyle,
          fontChoice: data.fontChoice,
          darkMode: data.darkMode,
        },
      });
    } else {
      themeConfig = await prisma.themeConfig.update({
        where: { profileId: profile.id },
        data: {
          preset: data.preset,
          customAccentColor: data.customAccentColor,
          cardStyle: data.cardStyle,
          fontChoice: data.fontChoice,
          darkMode: data.darkMode,
        },
      });
    }

    return themeConfig;
  }
}

export default new ProfileService();
