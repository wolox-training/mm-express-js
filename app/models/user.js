module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: DataTypes.INTEGER
      },
      // id used on Auth0
      externalId: {
        type: DataTypes.STRING,
        allowNull: false
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true
      },
      role: {
        type: DataTypes.ENUM('user', 'admin'), // eslint-disable-line new-cap
        allowNull: false,
        defaultValue: 'user'
      },
      points: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: '0'
      }
    },
    { underscored: true, tableName: 'users' }
  );
  User.associate = ({ Weet, Rating }) => {
    User.hasMany(Weet, { foreignKey: 'userId' });
    User.hasMany(Rating, { foreignKey: 'ratingUserId', as: 'ratingsMade' });
  };
  return User;
};
