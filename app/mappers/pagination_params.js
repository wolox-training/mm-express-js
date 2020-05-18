exports.paginationParamsMapper = ({ page = 1, limit = 10 }) => ({ limit, offset: (page - 1) * limit });
