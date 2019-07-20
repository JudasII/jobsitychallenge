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

const adminUser = {
  firstName: 'admin',
  lastName: 'pro',
  email: 'admin@gmail.com',
  password: 'adminpw123',
  admin: true
};

const mockChatRoom = {
    theme: 'potatoes',
    participan: 'john.doe@gmail.com',
    private: false
  };
const mockPrivate = {
    theme: 'fruits',
    participan: 'john.doe@gmail.com',
    private: true,
    password = 'iliketoeatapplesandbananas'
  };
describe('chatroom api tests', () => {
    test('an admin User tries to create a new  private chatroom, then another user logs in using a correct password', () =>
    Users.createWithHashedPassword(adminUser)
      .then(() =>
        request(server)
          .post('/users/sessions')
          .query({
            email: 'admin@gmail.com',
            password: 'adminpw123'
          })
      )
      .then(res =>
        request(server)
          .post('/chat/createPrivate')
          .query(mockPrivate)
          .set('Authorization', res.body.token)
          .then(response => expect(response.text).toEqual(`The new room "${newRoom.theme}" was created successfully`))
      )
      .then(
        Users.createWithHashedPassword(mockedUser)
        .then(() =>
          request(server)
            .post('/users/sessions')
            .query({
              email: 'john.doe@gmail.com',
              password: 'password123'
            })
            .then(res =>
                request(server)
                  .post('/chat/login')
                  .query(
                      { 
                        ...mockPrivate,  
                        password: 'iliketoeatapplesandbananas'
                      }
                  )
                  .set('Authorization', res.body.token)
                  .then(response => expect(response.text).toEqual(`Authentication successful!`))
                )
            )
        )
      );
    test('an admin User tries to create a new  public chatroom, then another user logs in', () =>
    Users.createWithHashedPassword(adminUser)
      .then(() =>
        request(server)
          .post('/users/sessions')
          .query({
            email: 'admin@gmail.com',
            password: 'adminpw123'
          })
      )
      .then(res =>
        request(server)
          .post('/chat/createPublic')
          .query(mockChatRoom)
          .set('Authorization', res.body.token)
          .then(response => expect(response.text).toEqual(`The new room "${newRoom.theme}" was created successfully`))
      )
      .then(
        Users.createWithHashedPassword(mockedUser)
        .then(() =>
          request(server)
            .post('/users/sessions')
            .query({
              email: 'john.doe@gmail.com',
              password: 'password123'
            })
            .then(res =>
                request(server)
                  .post('/chat/login')
                  .query(
                      { 
                        mockChatRoom
                      }
                  )
                  .set('Authorization', res.body.token)
                  .then(response => expect(response.text).toEqual(`Authentication successful!`))
                )
            )
        )
      );
      test('regular user tries to create a private room, returns unauthorized error', () =>
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
            .post('/chat/createPrivate')
            .set('Authorization', res.body.token)
            .then(response =>
              expect(response.body).toEqual({
                internal_code: 'unauthorized_error',
                message: 'You must be admin user for use this service'
              })
            )
        ));
    test('regular user tries to create a public room, returns unauthorized error', () =>
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
            .post('/chat/createPublic')
            .set('Authorization', res.body.token)
            .then(response =>
            expect(response.body).toEqual({
                internal_code: 'unauthorized_error',
                message: 'You must be admin user for use this service'
            })
            )
        ));
    test('get a list of rooms', () =>
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
            .get('/chat')
            .set('Authorization', res.body.token)
            .then(chats => expect(chat.length).ToBeAtLeast(1))
        )
    );
    test('get a list of rooms with filter', () =>
chatroom.createWithHashedPassword(mockChatRoom).then(() =>
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
            .get('/chat/find')
            .query({
                theme:'potatoes'
            })
            .set('Authorization', res.body.token)
            .then(chat => expect(chat.length).ToBeAtLeast(1))
        )
    ));
});