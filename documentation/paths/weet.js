module.exports = {
  '/weets': {
    get: {
      tags: ['Weets'],
      description: 'List weets',
      operationId: 'listWeets',
      security: [{ BearerAuth: [] }],
      parameters: [
        {
          name: 'limit',
          in: 'query',
          description: 'Limit of elements to list',
          schema: { type: 'integer', default: 10 }
        },
        {
          name: 'page',
          in: 'query',
          description: 'Page number',
          schema: { type: 'integer', default: 1 }
        }
      ],
      responses: {
        200: {
          description: 'Weets page',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  page: { $ref: '#/components/schemas/weets' },
                  total_count: { type: 'integer', example: 1500 }
                }
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
        }
      }
    },
    post: {
      tags: ['Weets'],
      description: 'Create weet',
      operationId: 'createWeet',
      security: [{ BearerAuth: [] }],
      responses: {
        201: {
          description: 'New weet was created',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/weet'
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
        502: {
          description: 'External service error',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/error'
              },
              example: {
                message: 'Error when getting response from third part api',
                internal_code: 'external_service_error'
              }
            }
          }
        }
      }
    }
  }
};
