module.exports = {
  '/users': {
    get: {
      tags: ['Users'],
      description: 'List users',
      operationId: 'listUsers',
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
          description: 'User page',
          content: {
            'application/json': {
              schema: {
                type: 'object',
                properties: {
                  page: { $ref: '#/components/schemas/Users' },
                  total_count: { type: 'integer', example: 1 }
                }
              }
            }
          }
        }
      }
    },
    post: {
      tags: ['Users'],
      description: 'Create user',
      operationId: 'createUser',
      parameters: [],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/UserCreationBody'
            }
          }
        },
        required: true
      },
      responses: {
        201: {
          description: 'New user was created',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/User'
              }
            }
          }
        },
        422: {
          description: 'Invalid parameters',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              examples: {
                field_validation_error: {
                  summary: 'Field validation error',
                  value: {
                    message: 'first_name must be present',
                    internal_code: 'field_validation_error'
                  }
                },
                user_email_repeated_error: {
                  summary: 'E-mail already in use error',
                  value: {
                    message: 'E-mail already in use',
                    internal_code: 'user_email_repeated_error'
                  }
                }
              }
            }
          }
        }
      }
    }
  }
};
