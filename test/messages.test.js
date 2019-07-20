const { Users, chatroom } = require('../app/models'),
  server = require('../app'),
  dictum = require('dictum.js'),
  request = require('supertest');

const mockedUser = {
  firstName: 'john',
  lastName: 'doe',
  email: 'john.doe@gmail.com',
  password: 'password123'
};

const mockmessage = {
    from: 'john',
    to: 'world',
    content: 'hello world!'
  };
describe('chatroom api tests', () => {
    test('an User sends a message while loged in', () =>
    Users.createWithHashedPassword(mockedUser)
      .then(() =>
        request(server)
          .post('/users/sessions')
          .query({
            email: 'john.doe@gmail.com',
            password: 'password123'
          })
      )
      .then(res =>
        request(server)
          .post('/messages/send')
          .query(mockmessage)
          .set('Authorization', res.body.token)
          .then(response => expect(response.status).toEqual(201))
          )
    );
    test('an user looks for all the messages', () =>
        Users.createWithHashedPassword(mockedUser)
        .then(() =>
            request(server)
            .post('/users/sessions')
            .query({
                email: 'john.doe@gmail.com',
                password: 'password123'
            })
        )
        .then(res =>
            request(server)
            .get('/messages')
            .query(mockmessage)
            .set('Authorization', res.body.token)
            .then(response => expect(response.text.length).toBeLessThan(50))
            )
            );
    test('an user looks for specific messages', () =>
        Users.createWithHashedPassword(mockedUser)
        .then(() =>
            request(server)
            .post('/users/sessions')
            .query({
                email: 'john.doe@gmail.com',
                password: 'password123'
            })
        )
        .then(res =>
            request(server)
            .get('/messages')
            .query({
                content: 'hello'
            })
            .set('Authorization', res.body.token)
            .then(response => expect(response.status).toEqual(200))
            )
            );
});