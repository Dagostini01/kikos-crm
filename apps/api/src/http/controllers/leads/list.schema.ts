export const listLeadsSchema = {
  tags: ['Leads'],
  summary: 'List leads',
  response: {
    200: {
      type: 'object',
      required: ['leads'],
      properties: {
        leads: {
          type: 'array',
          items: {
            type: 'object',
            required: [
              'id',
              'name',
              'email',
              'createdAt',
              'updatedAt',
              'seller',
              'status',
              'lastInteractionAt',
            ],
            properties: {
              id: { type: 'string' },
              name: { type: 'string' },
              email: { type: 'string', format: 'email' },
              createdAt: { type: 'string', format: 'date-time' },
              updatedAt: { type: 'string', format: 'date-time' },
              seller: {
                anyOf: [
                  {
                    type: 'object',
                    required: ['id', 'name'],
                    properties: {
                      id: { type: 'string' },
                      name: { type: 'string' },
                    },
                  },
                  { type: 'null' },
                ],
              },
              status: {
                anyOf: [
                  {
                    type: 'string',
                    enum: ['NEW', 'IN_PROGRESS', 'WON', 'LOST'],
                  },
                  { type: 'null' },
                ],
              },
              lastInteractionAt: {
                anyOf: [
                  { type: 'string', format: 'date-time' },
                  { type: 'null' },
                ],
              },
            },
          },
        },
      },
    },
  },
} as const;
