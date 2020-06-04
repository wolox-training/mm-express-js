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
      password: {
        type: DataTypes.STRING,
        allowNull: false
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
      },
      sessionsExpiredAt: {
        type: DataTypes.DATE,
        allowNull: true
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
