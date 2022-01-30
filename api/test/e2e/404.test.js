const {expect, assert} = require('chai');
const {router, server} = require('./../../index');
const clientHttp = require('supertest');

describe('404 Not found', () => {
  after(() => {
    server.close();
  });

  it("GET /foobar should 404 text/plain", (done) => {
    clientHttp(router)
    .get("/foobar")
    .expect('Content-Type', /text/)
    .expect(404)
    .end((error) => {
      if(error) {
        done(error);
      } else {
        done();
      }
    })

  });

  it("PUT /admin/login should 404 text/plain", done => {
    clientHttp(router)
    .put("/admin/login")
    .set("Content-Type", "application/json")
    .send({login: "test", password: "test"})
    .expect('Content-Type', /text/)
    .expect(404)
    .end((error) => {
      if(error) {
        done(error);
      } else {
        done();
      }
    });
  });

  it("POST /admin/logout should 404 text/plain", done => {
    clientHttp(router)
    .post("/admin/logout")
    .set("Content-Type", "application/json")
    .expect('Content-Type', /text/)
    .expect(404)
    .end((error) => {
      if(error) {
        done(error);
      } else {
        done();
      }
    })
  });
});
