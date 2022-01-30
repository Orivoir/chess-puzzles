const {expect, assert} = require('chai');
const {router, server} = require('./../../index');
const clientHttp = require('supertest');
const jwt = require('jsonwebtoken');
const jwtConfig = require('./../../config/private/jwt.json');

describe('POST /admin/login', () => {

  after(() => {
    server.close();
  });

  const onCreateTokens = (response) => {
    
    const {body} = response;

    try {
      assert.isTrue(body.success);
      assert.isObject(body.token);
      assert.isObject(body.refreshToken);

      assert.isString(body.token.value);
      assert.isString(body.refreshToken.value);

      assert.isNumber(body.refreshToken.expiresAt);
      assert.isNumber(body.token.expiresAt);
    } catch(error) {
      return error;
    }

    const {token} = body;

    // verifiy integrity token
    let payload = null;
    try {
      payload = jwt.verify(token.value, jwtConfig.normal.secret, {
        algorithms: [jwtConfig.normal.algorithm]
      });
    } catch(jsonWebTokenError) {
      return jsonWebTokenError;
    }
    try {
      assert.isObject(payload);
      expect(payload.login).to.be.equal("test");
      expect(payload.password).to.be.equal("test");
    } catch(error) {
      return error;
    }
  };

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
      done(onCreateTokens(response));
    })
  });

});