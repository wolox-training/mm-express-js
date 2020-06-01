module.exports = {
  '/weets/{weetId}/ratings': {
    post: {
      tags: ['Ratings'],
      description: 'Create rating',
      operationId: 'createRating',
      security: [{ BearerAuth: [] }],
      parameters: [{ in: 'path', name: 'weetId', schema: { $ref: '#/components/schemas/weetId' } }],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/ratingCreationBody'
            }
          }
        },
        required: true
      },
      responses: {
        201: {
          description: 'New rating was created',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/rating'
              }
            }
          }
        },
        401: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/authorizationError'
              }
            }
          }
        },
        404: {
          description: 'Weet not found',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/error'
              },
              example: {
                message: 'Not found Weet with id: 14',
                internal_code: 'resource_not_found_error'
              }
            }
          }
        },
        422: {
          description: 'Invalid parameters',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/fieldValidationError'
              }
            }
          }
        }
      }
    }
  }
};
