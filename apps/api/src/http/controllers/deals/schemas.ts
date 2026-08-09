const leadSchema = {
  type: 'object',
  required: ['id', 'name', 'email'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
  },
} as const;

const sellerSchema = {
  type: 'object',
  required: ['id', 'name', 'email'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
  },
} as const;

export const dealSchema = {
  type: 'object',
  required: [
    'id',
    'title',
    'valueInCents',
    'status',
    'leadId',
    'sellerId',
    'createdAt',
    'updatedAt',
    'lead',
    'seller',
  ],
  properties: {
    id: { type: 'string' },
    title: { type: 'string' },
    valueInCents: { type: 'integer', minimum: 1 },
    status: {
      type: 'string',
      enum: ['NEW', 'IN_PROGRESS', 'WON', 'LOST'],
    },
    leadId: { type: 'string' },
    sellerId: { type: 'string' },
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
    lead: leadSchema,
    seller: sellerSchema,
  },
} as const;

export const dealResponseSchema = {
  type: 'object',
  required: ['deal'],
  properties: {
    deal: dealSchema,
  },
} as const;

export const idParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', minLength: 1 },
  },
} as const;

export const errorResponseSchema = {
  type: 'object',
  required: ['message'],
  properties: {
    message: { type: 'string' },
  },
} as const;

export const dealBodySchema = {
  type: 'object',
  required: ['title', 'valueInCents', 'leadId', 'sellerId'],
  properties: {
    title: { type: 'string', minLength: 1 },
    valueInCents: { type: 'integer', minimum: 1 },
    leadId: { type: 'string', minLength: 1 },
    sellerId: { type: 'string', minLength: 1 },
  },
} as const;
