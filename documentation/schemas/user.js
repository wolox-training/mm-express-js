module.exports = {
  userId: {
    type: 'integer',
    example: 7
  },
  firstName: {
    type: 'string',
    example: 'rick'
  },
  lastName: {
    type: 'string',
    example: 'sanchez'
  },
  userEmail: {
    type: 'string',
    example: 'rick.sanchez@wolox.com.ar'
  },
  password: {
    type: 'password',
    example: 'PassWord_123'
  },
  UserCreationBody: {
    type: 'object',
    properties: {
      first_name: {
        $ref: '#/components/schemas/firstName'
      },
      last_name: {
        $ref: '#/components/schemas/lastName'
      },
      email: {
        $ref: '#/components/schemas/userEmail'
      },
      password: {
        $ref: '#/components/schemas/password'
      }
    },
    required: ['first_name', 'last_name', 'email', 'password']
  },
  User: {
    type: 'object',
    properties: {
      id: {
        $ref: '#/components/schemas/userId'
      },
      first_name: {
        $ref: '#/components/schemas/firstName'
      },
      last_name: {
        $ref: '#/components/schemas/lastName'
      },
      email: {
        $ref: '#/components/schemas/userEmail'
      }
    }
  },
  Users: {
    type: 'array',
    items: {
      $ref: '#/components/schemas/User'
    }
  }
};
