module.exports = {
  '/users/sessions': {
    post: {
      tags: ['Sessions'],
      description: 'Creates a session',
      operationId: 'createUserSession',
      parameters: [],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/sessionCreationBody'
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
                $ref: '#/components/schemas/session'
              }
            }
          }
        },
        401: {
          description: 'Invalid credentials',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/error'
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
                  $ref: '#/components/schemas/fieldValidationError'
                }
              }
            }
          }
        }
      }
    }
  },
  '/users/sessions/invalidate_all': {
    post: {
      tags: ['Sessions'],
      description: 'Invalidates all user sessions',
      operationId: 'invalidateAllSessions',
      security: [{ BearerAuth: [] }],
      parameters: [],
      responses: {
        200: {
          description: 'All sessions invalidated'
        },
        401: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/error'
              },
              example: {
                message: 'Invalid token',
                internal_code: 'authorization_error'
              }
            }
          }
        }
      }
    }
  }
};
