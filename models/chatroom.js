'use strict';
const bcrypt = require('bcrypt'),
 { Users } = require('./users'),
saltRounds=10;
module.exports = (sequelize, DataTypes) => {
  const chatRoom = sequelize.define('chatRoom', {
    theme: {
      allowNull: false,
      type: DataTypes.STRING
    },
    participant: {
      allowNull: true,
      type: DataTypes.STRING
    },
    private: {
      allowNull: true,
      type: DataTypes.BOOLEAN
    },    
    password: {
      allowNull: true,
      type: DataTypes.STRING
    }
  }, {});
  chatRoom.createWithHashedPassword = room => {
    const hashedPassword = bcrypt.hashSync(room.password, saltRounds);
    return chatRoom.create({ ...room, password: hashedPassword })
      .then(newRoom => {
        logger.info(`The new room "${newRoom.email}" was created successfully`);
        return newRoom;
      })
      .catch(err => {
        logger.error('Database error has occurred');
        throw databaseError(err);
      });
  };
  chatRoom.createPublic = room => {
    return chatRoom.create({ room })
      .then(newRoom => {
        logger.info(`The new room "${newRoom.email}" was created successfully`);
        return newRoom;
      })
      .catch(err => {
        logger.error('Database error has occurred');
        throw databaseError(err);
      });
  };
  chatRoom.getAll = () =>
  chatRoom.findAll()
    .then(rooms => rooms)
    .catch(err => {
      console.log('Database error has occurred');
      throw databaseError(err);
    });

chatRoom.findRoom = data =>
  chatRoom.findOne({
    where: { theme: data.theme }
  })
    .then(room => room)
    .catch(err => {
      comsole.log('Database error has occurred');
      throw databaseError(err);
    });
    
chatRoom.insertUser = data =>chatRoom.create({data});

chatRoom.associate = function(models) {
    chatRoom.belongsToMany(Users,{through: 'commonInterests'})
  };
  return chatRoom;
};