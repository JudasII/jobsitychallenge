const { Users } = require('../app/models'),
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

describe('users api tests', () => {
  test('create user with valid input and the user does not exist creates correctly', () =>
    Users.createWithHashedPassword(mockedUser).then(user =>
      expect(user).toMatchObject({
        firstName: 'john',
        lastName: 'doe',
        email: 'john.doe@gmail.com'
      })
    ));

  test('create user with existing user failed creation', async () => {
    await Users.createWithHashedPassword(mockedUser);
    const userWithExistingEmail = {
      firstName: 'mr',
      lastName: 'person',
      email: 'john.doe@gmail.com',
      password: '12345678'
    };
    await expect(Users.createWithHashedPassword(userWithExistingEmail)).rejects.toEqual({
      internalCode: 'database_error',
      message: 'email must be unique'
    });
  });

  test('create user with invalid password failed creation', done => {
    request(server)
      .post('/users')
      .send({
        firstName: 'john',
        lastName: 'doe',
        email: 'john@gmail.com',
        password: 'pas'
      })
      .expect(400)
      .end(err => {
        if (err) {
          throw err;
        }
        done();
      });
  });

  test('create user with missing lastName param failed creation', done => {
    request(server)
      .post('/users')
      .send({
        firstName: 'Foo',
        email: 'email@gmail.co',
        password: '12345678'
      })
      .expect(400)
      .end(err => {
        if (err) {
          throw err;
        }
        done();
      });
  });

  test('login with invalid password fails token creation', done => {
    request(server)
      .post('/users/sessions')
      .send({
        email: 'john.doe@gmail.com',
        password: '12345'
      })
      .expect(400)
      .end(err => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  test('login with missing email fails token creation', done => {
    request(server)
      .post('/users/sessions')
      .send({
        password: '123456!'
      })
      .expect(400)
      .end(err => {
        if (err) {
          return done(err);
        }
        return done();
      });
  });

  test('login with inexistent user fails token creation', () =>
    request(server)
      .post('/users/sessions')
      .send({
        email: 'unknownuser@email.co',
        password: '12345!'
      })
      .expect(403)
      .then(result =>
        expect(JSON.parse(result.text)).toEqual({
          message: 'Incorrect username or password',
          internal_code: 'forbidden_error'
        })
      ));

  test('getAll with one user returns all users', () =>
    Users.createWithHashedPassword(mockedUser)
      .then(user => user)
      .then(() => Users.getAll())
      .then(users => expect(users.length).ToBeAtLeast(1)));

  test('checkToken with invalid jwt returns invalid token error', () =>
    Users.createWithHashedPassword(mockedUser)
      .then(() =>
        request(server)
          .post('/users/sessions')
          .send({
            email: 'john.doe@gmail.com',
            password: 'password123'
          })
      )
      .then(() =>
        request(server)
          .get('/users')
          .set('Authorization', 'a.invalid.token')
          .expect(403)
          .then(response =>
            expect(JSON.parse(response.text)).toEqual({
              internal_code: 'forbidden_error',
              message: 'invalid token'
            })
          )
      ));

  test('checkToken with valid jwt returns the users list', () =>
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
          .get('/users')
          .set('Authorization', res.body.token)
          .then(response => {
            expect(response.body.length).toEqual(1);
            dictum.chai(response, 'This endpoint gets the users list or creates a new regular user');
          })
      ));

  test('createUserAdmin without jwt returns an forbidden error', () =>
    request(server)
      .post('/admin/users')
      .expect(403)
      .then(response =>
        expect(JSON.parse(response.text)).toEqual({
          message: 'jwt must be provided',
          internal_code: 'forbidden_error'
        })
      ));

  test('createUserAdmin with jwt and regular user returns unauthorized error', () =>
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
          .post('/admin/users')
          .set('Authorization', res.body.token)
          .then(response =>
            expect(response.body).toEqual({
              internal_code: 'unauthorized_error',
              message: 'You must be admin user for use this service'
            })
          )
      ));

  test('createUserAdmin with jwt and all params and user admin and another existent user modify the regular user permissions to admin', () =>
    Users.createWithHashedPassword(adminUser)
      .then(Users.createWithHashedPassword(mockedUser))
      .then(() =>
        request(server)
          .post('/users/sessions')
          .query({
            email: 'admin@gmail.com',
            password: 'password123'
          })
      )
      .then(res =>
        request(server)
          .post('/admin/users')
          .query(mockedUser)
          .set('Authorization', res.body.token)
          .then(response => expect(response.text).toEqual('[1]'))
      ));

  test('createUserAdmin with jwt and all params and user admin and inexistent user creates a new admin user', () =>
    Users.createWithHashedPassword(adminUser)
      .then(() =>
        request(server)
          .post('/users/sessions')
          .query({
            email: 'admin@gmail.com',
            password: 'password123'
          })
      )
      .then(res =>
        request(server)
          .post('/admin/users')
          .query({
            firstName: 'foo',
            lastName: 'bar',
            email: 'unknownuser@gmail.com',
            password: 'password123'
          })
          .set('Authorization', res.body.token)
          .then(response => expect(JSON.parse(response.text).admin).toEqual(true))
      ));
});