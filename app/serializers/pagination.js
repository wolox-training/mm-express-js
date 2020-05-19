exports.pageSerializer = eachSerializer => ({ count, rows }) => ({
  total_count: count,
  page: rows.map(eachSerializer)
});
