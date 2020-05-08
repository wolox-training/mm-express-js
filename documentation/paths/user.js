module.exports = {
  '/users': {
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
