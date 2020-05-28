module.exports = {
  weetId: {
    type: 'integer',
    example: 14
  },
  weetContent: {
    type: 'string',
    example: 'Chuck Norris can judge a book by its cover'
  },
  weet: {
    type: 'object',
    properties: {
      id: {
        $ref: '#/components/schemas/weetId'
      },
      content: {
        $ref: '#/components/schemas/weetContent'
      },
      user_id: {
        $ref: '#/components/schemas/userId'
      }
    }
  },
  weets: {
    type: 'array',
    items: {
      $ref: '#/components/schemas/weet'
    }
  }
};
