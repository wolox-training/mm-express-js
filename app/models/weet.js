module.exports = (sequelize, DataTypes) => {
  const Weet = sequelize.define(
    'Weet',
    {
      content: {
        type: DataTypes.TEXT,
        allowNull: false
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        onUpdate: 'cascade',
        onDelete: 'cascade'
      }
    },
    { underscored: true, tableName: 'weets' }
  );
  Weet.associate = ({ User }) => {
    Weet.belongsTo(User, { foreignKey: 'userId' });
  };
  return Weet;
};
