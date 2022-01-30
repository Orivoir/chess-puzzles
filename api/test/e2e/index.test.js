describe("HTTP e2e", () => {

  let dao = null;
  after(() => {
    dao.close();
    console.log("> Mongo DB connection close");
  });
  before((done) => {
    process.on("mongo-connected", ({connection}) => {
      dao = connection;
      done();
    });
  });

  
  require('./404.test');
  require('./authentication.test');
})