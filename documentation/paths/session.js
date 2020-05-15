module.exports = {
  '/users/sessions': {
    post: {
      tags: ['Users'],
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
        200: {
          description: 'Token returned',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Session'
              }
            }
          }
        },
        401: {
          description: 'Invalid credentials',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
              },
              example: {
                message: 'User or password are invalid',
                internal_code: 'invalid_login_error'
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
                example: {
                  message: 'email must be present',
                  internal_code: 'field_validation_error'
                }
              }
            }
          }
        }
      }
    }
  }
};
