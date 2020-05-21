module.exports = {
  '/admin/users': {
    post: {
      tags: ['Users'],
      description: 'Create admin user',
      operationId: 'createAdminUser',
      security: [{ BearerAuth: [] }],
      parameters: [],
      requestBody: {
        content: {
          'application/json': {
            schema: {
              $ref: '#/components/schemas/userCreationBody'
            }
          }
        },
        required: true
      },
      responses: {
        201: {
          description: 'New admin user was created',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/user'
              }
            }
          }
        },
        401: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/error'
              },
              example: {
                message: 'You need to be logged in',
                internal_code: 'authorization_error'
              }
            }
          }
        },
        403: {
          description: 'Forbidden',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/error'
              },
              example: {
                message: 'You have not permission to access this resource',
                internal_code: 'permisions_error'
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
