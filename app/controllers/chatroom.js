const { chatRoom, Users } = require('../../models'),
  errors = require('../errors'),
  bcrypt = require('bcrypt');

 
exports.createPrivate = (req, res, next) =>
  chatRoom.createWithHashedPassword(req.query)
    .then(room => res.status(201).send(room))
    .catch(next);
exports.createPublic = (req, res, next) =>
    chatRoom.createPublic(req.query)
      .then(room => res.status(201).send(room))
      .catch(next);
exports.getAllRooms = (req, res, next) =>
  chatRoom.getAll(req.query)
    .then(rooms => res.status(200).send(rooms))
    .catch(next);
exports.findRoom = (req, res, next) =>
  chatRoom.findRoom(req.query)
    .then(rooms => res.status(200).send(rooms))
    .catch(next);
exports.loginRoom = async (req, res, next) => {
  try {
    const room = await chatRoom.findUser(req.query);
    const user = await Users.findRoom(req.query)
    if (room) {
        if(room.private){
            const matches = await bcrypt.compare(req.query.password, room.password);
            if (matches) {
                chatRoom.insertUser({...room, participant: user.email})
                res.status(201).send({
                message: 'Authentication successful!'
                });
                return;
            }
            throw errors.forbiddenError('Incorrect password');
        }
        else{
            chatRoom.insertUser({...room, participant: user.email})
            res.status(201).send({
            message: 'Authentication successful!'
            });
            return;
        }
    }
    throw errors.forbiddenError('unnexistent or incorrect room')
  } catch (err) {
    next(err);
  }
};
