export const deleteLeadSchema = {
  tags: ['Leads'],
  summary: 'Delete a lead',
  params: {
    type: 'object',
    required: ['id'],
    properties: {
      id: { type: 'string', minLength: 1 },
    },
  },
  response: {
    204: {
      type: 'null',
      description: 'Lead deleted successfully',
    },
    404: {
      type: 'object',
      required: ['message'],
      properties: {
        message: { type: 'string' },
      },
    },
  },
} as const;
