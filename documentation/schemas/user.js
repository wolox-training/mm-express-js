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
  jobPosition: {
    type: 'string',
    enum: ['DEVELOPER', 'LEAD', 'TL', 'EM', 'HEAD', 'CEO'],
    example: 'DEVELOPER'
  },
  userPoints: {
    type: 'integer',
    example: -2
  },
  userCreationBody: {
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
  user: {
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
      },
      points: {
        $ref: '#/components/schemas/userPoints'
      },
      job_position: {
        $ref: '#/components/schemas/jobPosition'
      }
    }
  },
  users: {
    type: 'array',
    items: {
      $ref: '#/components/schemas/user'
    }
  }
};
