'use strict';
const bcrypt = require('bcrypt'),
    { chatRoom, Message } = require('./index')
saltRounds=10;

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define('Users', {
    name: {
      allowNull: false,
      type: DataTypes.STRING
    },
    lastName: {
      allowNull: false,
      type: DataTypes.STRING
    },
    email: {
      allowNull: false,
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isEmail: true
      }
    },
    password: {
      allowNull: false,
      type: DataTypes.STRING,
      validate: {
        len: {
          args: [8],
          msg: 'Minimum 8 characters are required in the password'
        }
      }
    },
    admin: {
      allowNull: false,
      defaultValue: false,
      type: DataTypes.BOOLEAN
    }
  }, {});
  
  Users.createWithHashedPassword = user => {
    const hashedPassword = bcrypt.hashSync(user.password, saltRounds);
    return User.create({ ...user, password: hashedPassword })
      .then(userCreated => {
        console.log(`The new user "${userCreated.email}" was created successfully`);
        return userCreated;
      })
      .catch(err => {
        console.log('Database error has occurred');
        throw databaseError(err);
      });
  };

  Users.getAll = () =>
    Users.findAll()
      .then(users => users)
      .catch(err => {
        console.log('Database error has occurred');
        throw databaseError(err);
      });

  Users.findUser = data =>
    Users.findOne({
      where: { email: data.email }
    })
      .then(user => user)
      .catch(err => {
        console.log('Database error has occurred');
        throw databaseError(err);
      });
  Users.associate = function(models) {
    Users.belongsToMany( chatRoom, {through: 'commonInterests'})
    Users.hasMany( Message, {through: 'Message'})
  };
  return Users;
};