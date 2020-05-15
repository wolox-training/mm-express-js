const maxPageSize = 100;

exports.paginationParamsSchema = {
  page: {
    in: ['query'],
    isInt: { options: { min: 1 } },
    toInt: true,
    optional: true,
    errorMessage: 'page should be a positive integer'
  },
  limit: {
    in: ['query'],
    isInt: { options: { min: 1, max: maxPageSize } },
    toInt: true,
    optional: true,
    errorMessage: 'limit should be a positive integer'
  }
};
