export const APP_CONFIG = {
  name: 'MotherCare+',
  description: 'Prenatal Tracking System',
  version: '0.1.0',
} as const

export const UPLOAD_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'],
} as const

export const PAGINATION = {
  defaultPageSize: 10,
  maxPageSize: 100,
} as const


