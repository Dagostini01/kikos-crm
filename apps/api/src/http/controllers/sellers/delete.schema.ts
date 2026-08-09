export const deleteSellerSchema = {
  tags: ['Sellers'],
  summary: 'Delete a seller',
  params: {
    type: 'object',
    required: ['id'],
    properties: { id: { type: 'string', minLength: 1 } },
  },
  response: {
    204: {
      type: 'null',
      description: 'Seller deleted successfully',
    },
    404: {
      type: 'object',
      required: ['message'],
      properties: { message: { type: 'string' } },
    },
  },
} as const;
