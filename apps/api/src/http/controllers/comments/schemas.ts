export const commentAuthorSchema = {
  type: 'object',
  required: ['id', 'name', 'email'],
  properties: {
    id: { type: 'string' },
    name: { type: 'string' },
    email: { type: 'string', format: 'email' },
  },
} as const;

export const commentSchema = {
  type: 'object',
  required: [
    'id',
    'content',
    'leadId',
    'dealId',
    'authorId',
    'author',
    'createdAt',
    'updatedAt',
  ],
  properties: {
    id: { type: 'string' },
    content: { type: 'string' },
    leadId: {
      anyOf: [{ type: 'string' }, { type: 'null' }],
    },
    dealId: {
      anyOf: [{ type: 'string' }, { type: 'null' }],
    },
    authorId: { type: 'string' },
    author: commentAuthorSchema,
    createdAt: { type: 'string', format: 'date-time' },
    updatedAt: { type: 'string', format: 'date-time' },
  },
} as const;

export const commentResponseSchema = {
  type: 'object',
  required: ['comment'],
  properties: {
    comment: commentSchema,
  },
} as const;

export const commentsResponseSchema = {
  type: 'object',
  required: ['comments'],
  properties: {
    comments: {
      type: 'array',
      items: commentSchema,
    },
  },
} as const;

export const commentBodySchema = {
  type: 'object',
  required: ['content'],
  properties: {
    content: { type: 'string', minLength: 1 },
  },
} as const;

export const idParamsSchema = {
  type: 'object',
  required: ['id'],
  properties: {
    id: { type: 'string', minLength: 1 },
  },
} as const;

export const leadIdParamsSchema = {
  type: 'object',
  required: ['leadId'],
  properties: {
    leadId: { type: 'string', minLength: 1 },
  },
} as const;

export const dealIdParamsSchema = {
  type: 'object',
  required: ['dealId'],
  properties: {
    dealId: { type: 'string', minLength: 1 },
  },
} as const;

export const errorResponseSchema = {
  type: 'object',
  required: ['message'],
  properties: {
    message: { type: 'string' },
  },
} as const;
