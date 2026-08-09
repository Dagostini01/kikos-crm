import { errorResponseSchema, idParamsSchema } from './schemas.js';

export const deleteCommentSchema = {
  tags: ['Comments'],
  summary: 'Delete a comment',
  params: idParamsSchema,
  response: {
    204: {
      type: 'null',
      description: 'Comment deleted successfully',
    },
    404: errorResponseSchema,
  },
} as const;
