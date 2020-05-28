module.exports = {
  ratingId: {
    type: 'integer',
    example: 5
  },
  score: {
    type: 'integer',
    enum: [-1, 1],
    example: 1
  },
  ratingCreationBody: {
    type: 'object',
    properties: {
      score: {
        $ref: '#/components/schemas/score'
      }
    },
    required: ['score']
  },
  rating: {
    type: 'object',
    properties: {
      id: {
        $ref: '#/components/schemas/ratingId'
      },
      score: {
        $ref: '#/components/schemas/score'
      },
      rating_user_id: {
        $ref: '#/components/schemas/userId'
      },
      weet_id: {
        $ref: '#/components/schemas/weetId'
      }
    }
  }
};
