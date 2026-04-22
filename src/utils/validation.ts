import { z } from 'zod';
import { ValidationError } from '@/types';

// Common validation schemas
export const emailSchema = z.string().email('Invalid email address');
export const passwordSchema = z.string().min(8, 'Password must be at least 8 characters');
export const uuidSchema = z.string().uuid('Invalid UUID');

// Auth schemas
export const registerSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  accountType: z.enum(['INDIVIDUAL', 'COMPANY', 'STUDENT']),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string(),
});

export const refreshTokenSchema = z.object({
  refreshToken: z.string(),
});

// Profile schemas
export const profileUpdateSchema = z.object({
  headline: z.string().max(120).optional(),
  bio: z.string().max(500).optional(),
  location: z.string().optional(),
  openToWork: z.boolean().optional(),
  activelyHiring: z.boolean().optional(),
  visibility: z.enum(['PUBLIC', 'CONNECTIONS_ONLY', 'PRIVATE']).optional(),
});

// Certification schema
export const certificationSchema = z.object({
  name: z.string().min(1, 'Certification name is required'),
  issuingBody: z.string().min(1, 'Issuing body is required'),
  issueDate: z.string().datetime(),
  expiryDate: z.string().datetime().optional(),
  credentialId: z.string().optional(),
  verificationUrl: z.string().url().optional(),
  description: z.string().max(300).optional(),
});

// Job listing schema
export const jobListingSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  type: z.enum(['JOB', 'INTERNSHIP', 'FREELANCE', 'STARTUP_ROLE']),
  workMode: z.enum(['ONLINE', 'OFFLINE', 'HYBRID']),
  location: z.string().optional(),
  salaryMin: z.number().optional(),
  salaryMax: z.number().optional(),
  salaryNegotiable: z.boolean().optional(),
  experienceYears: z.number().optional(),
  experienceLevel: z.enum(['ENTRY', 'MID', 'SENIOR', 'LEAD']).optional(),
  skills: z.array(z.string()).optional(),
  description: z.string().max(2000).optional(),
  perksAndBenefits: z.string().optional(),
  deadline: z.string().datetime(),
  openings: z.number().min(1),
});

// Application schema
export const applicationSchema = z.object({
  coverLetter: z.string().max(1000).optional(),
  customAnswers: z.record(z.string()).optional(),
});

// Validation helper
export function validate<T>(schema: z.ZodSchema, data: unknown): T {
  try {
    return schema.parse(data) as T;
  } catch (error) {
    if (error instanceof z.ZodError) {
      const errors: Record<string, string> = {};
      error.errors.forEach((err) => {
        const path = err.path.join('.');
        errors[path] = err.message;
      });
      throw new ValidationError('Validation failed', errors);
    }
    throw error;
  }
}

// Email validation
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// URL validation
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

// File type validation
export const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
export const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/quicktime'];
export const ALLOWED_DOCUMENT_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'];

export function isAllowedImageType(mimeType: string): boolean {
  return ALLOWED_IMAGE_TYPES.includes(mimeType);
}

export function isAllowedVideoType(mimeType: string): boolean {
  return ALLOWED_VIDEO_TYPES.includes(mimeType);
}

export function isAllowedDocumentType(mimeType: string): boolean {
  return ALLOWED_DOCUMENT_TYPES.includes(mimeType);
}

// File size validation (in bytes)
export const MAX_FILE_SIZES = {
  image: 10 * 1024 * 1024, // 10MB
  video: 500 * 1024 * 1024, // 500MB
  document: 50 * 1024 * 1024, // 50MB
};

export function isFileSizeValid(fileSize: number, type: 'image' | 'video' | 'document'): boolean {
  return fileSize <= MAX_FILE_SIZES[type];
}
