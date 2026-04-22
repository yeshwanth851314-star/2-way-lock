// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  errors?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Auth types
export interface JWTPayload {
  userId: string;
  email: string;
  accountType: string;
  iat: number;
  exp: number;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
}

// User types
export interface UserWithProfile {
  id: string;
  email: string;
  accountType: string;
  verificationStatus: string;
  verificationBadge: string;
  profile?: {
    headline?: string;
    bio?: string;
    avatar?: string;
    location?: string;
    openToWork?: boolean;
    activelyHiring?: boolean;
    profileScore?: number;
  };
}

// File upload types
export interface FileUploadResult {
  url: string;
  fileHash: string;
  scanStatus: string;
  scanResult?: string;
  fileSize: number;
  fileName: string;
}

export interface ThreatScanResult {
  status: 'CLEAN' | 'THREAT_DETECTED' | 'SCAN_FAILED';
  threatName?: string;
  engine: string;
  timestamp: Date;
}

// Job listing types
export interface JobListingFilters {
  type?: string[];
  workMode?: string[];
  location?: string;
  salaryMin?: number;
  salaryMax?: number;
  experienceLevel?: string;
  skills?: string[];
  sortBy?: 'relevant' | 'newest' | 'salary_high' | 'salary_low';
  page?: number;
  pageSize?: number;
}

export interface JobListingWithMatches {
  id: string;
  title: string;
  company: string;
  matchScore?: number;
  matchReasons?: string[];
}

// AI Matching types
export interface AIMatchRequest {
  userId: string;
  type: 'JOB' | 'INTERNSHIP' | 'STARTUP';
}

export interface AIMatchResult {
  listingId: string;
  matchScore: number;
  matchReasons: string[];
  type: string;
}

// Notification types
export interface NotificationPayload {
  userId: string;
  type: string;
  title: string;
  body: string;
  link?: string;
}

// Error types
export class AppError extends Error {
  constructor(
    public statusCode: number,
    public message: string,
    public errors?: Record<string, any>
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export class ValidationError extends AppError {
  constructor(message: string, errors?: Record<string, any>) {
    super(400, message, errors);
    this.name = 'ValidationError';
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(401, message);
    this.name = 'UnauthorizedError';
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(403, message);
    this.name = 'ForbiddenError';
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Not found') {
    super(404, message);
    this.name = 'NotFoundError';
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflict') {
    super(409, message);
    this.name = 'ConflictError';
  }
}

// Request types
export interface AuthenticatedRequest extends Express.Request {
  user?: JWTPayload;
}

// Pagination types
export interface PaginationParams {
  page: number;
  pageSize: number;
  skip: number;
}

export function getPaginationParams(page?: number, pageSize?: number): PaginationParams {
  const p = Math.max(1, page || 1);
  const ps = Math.min(100, Math.max(1, pageSize || 20));
  return {
    page: p,
    pageSize: ps,
    skip: (p - 1) * ps,
  };
}
