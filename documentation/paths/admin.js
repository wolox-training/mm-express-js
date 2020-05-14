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
              $ref: '#/components/schemas/UserCreationBody'
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
                $ref: '#/components/schemas/User'
              }
            }
          }
        },
        401: {
          description: 'Unauthorized',
          content: {
            'application/json': {
              schema: {
                $ref: '#/components/schemas/Error'
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
                $ref: '#/components/schemas/Error'
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
                $ref: '#/components/schemas/Error'
              },
              example: {
                message: 'first_name must be present',
                internal_code: 'field_validation_error'
              }
            }
          }
        }
      }
    }
  }
};
