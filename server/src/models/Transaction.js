const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Transaction = sequelize.define('Transaction', {
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'User', key: 'id' },
    },
    playerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: 'Player', key: 'id' },
    },
    type: {
      type: DataTypes.ENUM('purchase', 'sale'),
      allowNull: false,
    },
    amount: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
  }, {
    tableName: 'Transaction',
    freezeTableName: true,
    timestamps: false,
  });

  return Transaction;
};
