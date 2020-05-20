module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define(
    'Rating',
    {
      ratingUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      weetId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onUpdate: 'cascade',
        onDelete: 'cascade'
      },
      score: {
        type: DataTypes.INTEGER,
        allowNull: false
      }
    },
    {
      underscored: true
    }
  );
  Rating.associate = ({ User, Weet }) => {
    Rating.belongsTo(User, { foreignKey: 'ratingUserId', as: 'RatingUser' });
    Rating.belongsTo(Weet, { foreignKey: 'weetId' });
  };
  return Rating;
};
