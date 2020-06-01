exports.ratingSchema = {
  score: {
    errorMessage: 'score must be 1 or -1',
    isIn: { options: [[1, -1]] },
    isInt: true,
    toInt: true
  }
};
