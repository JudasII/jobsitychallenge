'use strict';
const { Users } = require('./index')
module.exports = (sequelize, DataTypes) => {
  const Message = sequelize.define('message', {
    from: {
      allowNull: false,
      type: DataTypes.STRING
    },
    to: {
      allowNull: false,
      type: DataTypes.STRING
    },
    content: {
      allowNull: false,
      type: DataTypes.STRING
    },
  }, {});
  Message.send = message => {
    return Message.create({ message })
      .then(message => {
        return message.content;
      })
      .catch(err => {
        console.log('Database error has occurred');
        throw databaseError(err);
      });
  };
  Message.getAll = query =>
    Message.findAll({
      where: { from: query.sender, to: query.taker },
      limit: 50,
      order: ['createdAt', 'DESC']
    })
      .then(messages => messages)
      .catch(err => {
        console.log('Database error has occurred');
        throw databaseError(err);
      });
  Message.findMessages = query =>
    Message.findOne({
      where: { content: { [op.like] : `%${query.content}%`} },
      order: ['createdAt', 'DESC']
    })
      .then(messages => messages)
      .catch(err => {
        console.log('Database error has occurred');
        throw databaseError(err);
      });
Message.associate = function(models) {
    // associations can be defined here
    Message.belongsTo( Users, {through: 'Message'})
  };
  return Message;
};