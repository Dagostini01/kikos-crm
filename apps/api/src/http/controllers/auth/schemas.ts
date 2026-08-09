export const userSchema = {
  type: 'object',
  required: ['id', 'name', 'email', 'createdAt', 'updatedAt'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
} as const;

export const authSessionResponseSchema = {
  type: 'object',
  required: ['user', 'accessToken', 'refreshToken'],
  properties: {
    user: userSchema,
    accessToken: { type: 'string' },
    refreshToken: { type: 'string' },
  },
} as const;

export const tokensResponseSchema = {
  type: 'object',
  required: ['accessToken', 'refreshToken'],
  properties: {
    accessToken: { type: 'string' },
    refreshToken: { type: 'string' },
  },
} as const;

export const userResponseSchema = {
  type: 'object',
  required: ['user'],
  properties: {
    user: userSchema,
  },
} as const;

export const registerBodySchema = {
  type: 'object',
  required: ['name', 'email', 'password'],
  properties: {
    name: { type: 'string', minLength: 1 },
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 6 },
  },
} as const;

export const loginBodySchema = {
  type: 'object',
  required: ['email', 'password'],
  properties: {
    email: { type: 'string', format: 'email' },
    password: { type: 'string', minLength: 1 },
  },
} as const;

export const refreshBodySchema = {
  type: 'object',
  required: ['refreshToken'],
  properties: {
    refreshToken: { type: 'string', minLength: 1 },
  },
} as const;

export const errorResponseSchema = {
  type: 'object',
  required: ['message'],
  properties: {
    message: { type: 'string' },
  },
} as const;
