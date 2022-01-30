const {expect, assert} = require('chai');
const {router, server} = require('./../../index');
const clientHttp = require('supertest');
const jwt = require('jsonwebtoken');
const jwtConfig = require('./../../config/private/jwt.json');

describe('POST /admin/login', () => {

  after(() => {
    server.close();
  });

  it("should credentials errors with status 200", (done) => {

    clientHttp(router)
    .post("/admin/login")
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => {

      const {body} = response;

      try {
        assert.isObject(body);
        assert.isFalse(body.success);
        assert.isString(body.message);
        expect(body.message).to.equal("Credentials error");
  
        done();
      } catch(error) {
        done(error);
      }

    });

  });

  it("should success login with valid JWT token response", (done) => {
    clientHttp(router)
    .post("/admin/login")
    .set('Content-Type', 'application/json')
    .send({login: "test", password: "test"})
    .expect('Content-Type', /json/)
    .expect(200)
    .then(response => {

      const {body} = response;

      try {
        assert.isTrue(body.success);
        assert.isNumber(body.expiresAt);
        assert.isString(body.token);
      } catch(error) {
        done(error);
      }

      const {token} = body;

      // verfiy integrity token
      let payload = null;
      try {
        payload = jwt.verify(token, jwtConfig.secret, {
          algorithms: [jwtConfig.algorithm]
        });
      } catch(jsonWebTokenError) {
        done(jsonWebTokenError);
      }

      try {
        assert.isObject(payload);
        expect(payload.login).to.be.equal("test");
        expect(payload.password).to.be.equal("test");
        done();
      } catch(error) {
        done(error);
      }
        
    })
  });
});