module.exports = (sequelize, DataTypes) => {
  const Rating = sequelize.define(
    'Rating',
    {
      ratingUserId: {
        type: DataTypes.INTEGER,
        allowNull: true,
        onUpdate: 'cascade',
        onDelete: 'set null'
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
    Rating.belongsTo(User, { foreignKey: 'ratingUserId', as: 'ratingUser' });
    Rating.belongsTo(Weet, { foreignKey: 'weetId' });
  };
  return Rating;
};
