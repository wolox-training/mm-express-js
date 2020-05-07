module.exports = {
  '/users/sessions': {
    post: {
      tags: ['CRUD operations'],
      description: 'Create user session',
      operationId: 'createUserSession',
      parameters: [],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/SessionCreationBody'
            }
          }
        },
        required: true
      },
      responses: {
        201: {
          description: 'Token was created',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Session'
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
                    message: 'email must be present',
                    internal_code: 'field_validation_error'
                  }
                },
                invalid_login_error: {
                  summary: 'Invalid login',
                  value: {
                    message: 'User or password are invalid',
                    internal_code: 'invalid_login_error'
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
