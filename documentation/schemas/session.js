module.exports = {
  token: {
    type: 'string',
    example:
      'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOjcsImVtYWlsIjoibWFydGluLm1hbGxlYSsxMjJAd29sb3guY29tLmFyIn0.bia88q209mmnXNhHR7vxQ_TrDmCEmOfcK2unrdo1Yyg'
  },
  SessionCreationBody: {
    type: 'object',
    properties: {
      email: {
        $ref: '#/components/schemas/userEmail'
      },
      password: {
        $ref: '#/components/schemas/password'
      }
    },
    required: ['email', 'password']
  },
  Session: {
    type: 'object',
    properties: {
      token: {
        $ref: '#components/schemas/token'
      }
    }
  }
};
